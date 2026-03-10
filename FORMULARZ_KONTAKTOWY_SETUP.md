# Konfiguracja formularza kontaktowego

## Wymagane kroki do uruchomienia

### 1. Konfiguracja EmailJS

1. **Załóż konto na [EmailJS.com](https://www.emailjs.com/)**
2. **Utwórz serwis email** (np. Gmail, Outlook)
3. **Utwórz template emaila** z następującymi zmiennymi:

    ```
    {{from_name}} - imię użytkownika
    {{from_email}} - email użytkownika
    {{phone}} - telefon (opcjonalnie)
    {{offer_type}} - rodzaj oferty
    {{message}} - treść wiadomości
    ```

4. **Zaktualizuj klucze w `contact-pages.component.ts`:**

    ```typescript
    // W metodzie loadExternalScripts() - linia ~58
    emailjs.init('YOUR_PUBLIC_KEY_HERE'); // Twój public key z EmailJS

    // W metodzie sendMessage() - linia ~110
    const result = await emailjs.send(
    	'YOUR_SERVICE_ID', // ID serwisu emailowego
    	'YOUR_TEMPLATE_ID', // ID szablonu emaila
    	emailData
    );
    ```

### 2. Konfiguracja Google reCAPTCHA

1. **Idź do [Google reCAPTCHA](https://www.google.com/recaptcha/admin/)**
2. **Utwórz nowy site key** (wybierz reCAPTCHA v2)
3. **Zaktualizuj site key w `contact-pages.component.ts`:**
    ```typescript
    // Linia ~13
    recaptchaSiteKey = 'YOUR_RECAPTCHA_SITE_KEY_HERE';
    ```

### 3. Testowanie

1. **Lokalnie**: Formularz działa bez reCAPTCHA i EmailJS (wyświetli się komunikat w konsoli)
2. **Z EmailJS**: Po konfiguracji kluczy, emails będą wysyłane na Twój adres
3. **Z reCAPTCHA**: Po konfiguracji pojawi się widget weryfikacji

### 4. Deployment

Pamiętaj aby dodać domenę produkcyjną do:

-   **EmailJS**: Authorized domains
-   **reCAPTCHA**: Authorized domains

## Struktura formularza

-   **Responsywny layout**: kolumna na mobile, rzędy na desktop
-   **Walidacja**: wszystkie pola wymagane oprócz telefonu
-   **Bezpieczeństwo**: reCAPTCHA + walidacja frontend/backend
-   **UX**: loading states, success/error messages

## Opcje rozwoju

1. **Backend własny**: Zamiast EmailJS możesz użyć Node.js + Nodemailer
2. **Analytics**: Dodaj tracking wysyłania formularzy
3. **A/B testing**: Testuj różne wersje formularza
