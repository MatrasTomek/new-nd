import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

declare let grecaptcha: any;
declare let emailjs: any;

@Component({
	selector: 'app-contact-pages',
	templateUrl: './contact-pages.component.html',
	styleUrls: ['./contact-pages.component.scss'],
	standalone: false,
})
export class ContactPagesComponent implements OnInit, OnDestroy {
	contactForm!: FormGroup;
	isSubmitting = false;
	isSubmitted = false;
	recaptchaSiteKey = '6LfYourSiteKey'; // Tutaj wstaw swój site key z Google reCAPTCHA

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	ngOnInit() {
		this.initForm();
		if (isPlatformBrowser(this.platformId)) {
			this.loadExternalScripts();
		}
	}

	ngOnDestroy() {
		// Cleanup if needed
	}

	initForm() {
		this.contactForm = new FormGroup({
			name: new FormControl('', [Validators.required, Validators.minLength(2)]),
			email: new FormControl('', [Validators.required, Validators.email]),
			phone: new FormControl(''),
			offerType: new FormControl('', [Validators.required]),
			message: new FormControl('', [Validators.required, Validators.minLength(10)]),
			gdprAccepted: new FormControl(false, [Validators.requiredTrue]),
			recaptcha: new FormControl('', [Validators.required]),
		});
	}

	loadExternalScripts() {
		// Load reCAPTCHA
		if (!document.querySelector('script[src*="recaptcha"]')) {
			const recaptchaScript = document.createElement('script');
			recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
			recaptchaScript.async = true;
			recaptchaScript.defer = true;
			document.head.appendChild(recaptchaScript);
		}

		// Load EmailJS
		if (!document.querySelector('script[src*="emailjs"]')) {
			const emailjsScript = document.createElement('script');
			emailjsScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
			emailjsScript.onload = () => {
				emailjs.init('YOUR_PUBLIC_KEY'); // Tutaj wstaw swój public key z EmailJS
			};
			document.head.appendChild(emailjsScript);
		}
	}

	isFieldInvalid(fieldName: string): boolean {
		const field = this.contactForm.get(fieldName);
		return !!(field && field.invalid && (field.dirty || field.touched));
	}

	async executeRecaptcha(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (typeof grecaptcha !== 'undefined') {
				grecaptcha.ready(() => {
					grecaptcha
						.execute(this.recaptchaSiteKey, { action: 'contact_form' })
						.then((token: string) => {
							resolve(token);
						})
						.catch((error: any) => {
							reject(error);
						});
				});
			} else {
				reject('reCAPTCHA not loaded');
			}
		});
	}

	async sendMessage() {
		if (this.contactForm.valid) {
			this.isSubmitting = true;

			try {
				// Execute reCAPTCHA
				const recaptchaToken = await this.executeRecaptcha();
				this.contactForm.patchValue({ recaptcha: recaptchaToken });

				// Prepare email data
				const formData = {
					to_email: 'your-email@example.com', // Tutaj wstaw swój email
					from_name: this.contactForm.value.name,
					from_email: this.contactForm.value.email,
					phone: this.contactForm.value.phone || 'Nie podano',
					offer_type: this.getOfferTypeLabel(this.contactForm.value.offerType),
					message: this.contactForm.value.message,
					reply_to: this.contactForm.value.email,
				};

				// Send email via EmailJS
				const result = await emailjs.send(
					'YOUR_SERVICE_ID', // Tutaj wstaw swój service ID z EmailJS
					'YOUR_TEMPLATE_ID', // Tutaj wstaw swój template ID z EmailJS
					formData
				);

				console.log('Email sent successfully:', result);
				this.isSubmitted = true;
				this.contactForm.reset();

				setTimeout(() => {
					this.isSubmitted = false;
				}, 5000);
			} catch (error) {
				console.error('Błąd wysyłki:', error);
				alert('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
			} finally {
				this.isSubmitting = false;
			}
		} else {
			this.markFormGroupTouched();
		}
	}

	getOfferTypeLabel(value: string): string {
		const labels: { [key: string]: string } = {
			basic: 'Szablon podstawowy',
			advanced: 'Szablon zaawansowany',
			individual: 'Wycena indywidualna',
		};
		return labels[value] || value;
	}

	private markFormGroupTouched() {
		Object.keys(this.contactForm.controls).forEach((key) => {
			const control = this.contactForm.get(key);
			control?.markAsTouched();
		});
	}
}
