import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';

declare let emailjs: any;

@Component({
	selector: 'app-contact-pages',
	templateUrl: './contact-pages.component.html',
	styleUrls: ['./contact-pages.component.scss'],
	standalone: false,
})
export class ContactPagesComponent implements OnInit {
	contactForm!: FormGroup;
	isSubmitting = false;
	isSubmitted = false;

	private EMAIL_SERVICE_ID = environment.emailjs.serviceId;
	private EMAIL_TEMPLATE_ID = environment.emailjs.templateId;
	private EMAIL_PUBLIC_KEY = environment.emailjs.publicKey;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	ngOnInit() {
		this.initForm();
		if (isPlatformBrowser(this.platformId)) {
			this.loadEmailJs();
		}
	}

	initForm() {
		this.contactForm = new FormGroup({
			name: new FormControl('', [Validators.required, Validators.minLength(2)]),
			email: new FormControl('', [Validators.required, Validators.email]),
			phone: new FormControl(''),
			offerType: new FormControl('', [Validators.required]),
			message: new FormControl('', [Validators.required, Validators.minLength(10)]),
			gdprAccepted: new FormControl(false, [Validators.requiredTrue]),
		});
	}

	loadEmailJs() {
		if (!document.querySelector('script[src*="emailjs"]')) {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
			script.onload = () => emailjs.init(this.EMAIL_PUBLIC_KEY);
			document.head.appendChild(script);
		}
	}

	isFieldInvalid(fieldName: string): boolean {
		const field = this.contactForm.get(fieldName);
		return !!(field && field.invalid && (field.dirty || field.touched));
	}

	async sendMessage() {
		if (this.contactForm.invalid) {
			this.markFormGroupTouched();
			return;
		}

		this.isSubmitting = true;

		try {
			const { name, email, phone, offerType, message } = this.contactForm.value;

			await emailjs.send(this.EMAIL_SERVICE_ID, this.EMAIL_TEMPLATE_ID, {
				from_name: name,
				from_email: email,
				phone: phone || 'Nie podano',
				offer_type: this.getOfferTypeLabel(offerType),
				message,
				reply_to: email,
			});

			this.isSubmitted = true;
			this.contactForm.reset();

			setTimeout(() => (this.isSubmitted = false), 5000);
		} catch (error) {
			console.error('Błąd wysyłki:', error);
			alert('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
		} finally {
			this.isSubmitting = false;
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
