# Konfiguracja formularza kontaktowego

## 1. Google reCAPTCHA v3

### Krok 1: Zarejestruj swoją domenę

1. Idź do [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/)
2. Kliknij "+" aby dodać nową stronę
3. Wypełnij formularz:
    - **Etykieta**: Nazwa twojej strony
    - **Typ reCAPTCHA**: Wybierz "reCAPTCHA v3"
    - **Domeny**: Dodaj swoją domenę (np. `example.com`, `localhost` dla testów)
4. Zaakceptuj warunki i kliknij "Prześlij"

### Krok 2: Pobierz klucze

Po utworzeniu otrzymasz:

-   **Site Key** (klucz witryny) - publiczny
-   **Secret Key** (klucz tajny) - prywatny

### Krok 3: Zaktualizuj kod

W pliku `contact-pages.component.ts` zmień linię 17:

```typescript
recaptchaSiteKey = 'TWÓJ_SITE_KEY_TUTAJ';
```

## 2. EmailJS

### Krok 1: Załóż konto

1. Idź do [EmailJS](https://www.emailjs.com/)
2. Zarejestruj się za darmo
3. Potwierdź email

### Krok 2: Dodaj serwis email

1. W dashboard kliknij "Email Services"
2. Kliknij "Add New Service"
3. Wybierz swojego dostawcę (np. Gmail, Outlook, Yahoo)
4. Skonfiguruj połączenie zgodnie z instrukcjami
5. Zapisz **Service ID**

### Krok 3: Utwórz szablon

1. Idź do "Email Templates"
2. Kliknij "Create New Template"
3. Użyj tego szablonu:

**Subject**: Nowa wiadomość z formularza kontaktowego - {{from_name}}

**Content**:

```
Otrzymałeś nową wiadomość z formularza kontaktowego:

Imię: {{from_name}}
Email: {{from_email}}
Telefon: {{phone}}
Rodzaj oferty: {{offer_type}}

Wiadomość:
{{message}}

---
Ta wiadomość została wysłana automatycznie z formularza kontaktowego.
```

4. Zapisz **Template ID**

### Krok 4: Pobierz Public Key

1. W dashboard idź do "Account"
2. Znajdź sekcję "General"
3. Skopiuj **Public Key**

### Krok 5: Zaktualizuj kod

W pliku `contact-pages.component.ts` zaktualizuj linie:

Linia 49:

```typescript
emailjs.init('TWÓJ_PUBLIC_KEY'); // Wstaw swój Public Key
```

Linia 82:

```typescript
to_email: 'twoj-email@example.com', // Wstaw swój email docelowy
```

Linie 88-89:

```typescript
'TWÓJ_SERVICE_ID', // Wstaw swój Service ID
'TWÓJ_TEMPLATE_ID', // Wstaw swój Template ID
```

## 3. Testowanie

### Testy lokalne:

1. Uruchom aplikację: `npm start`
2. Idź do strony kontaktowej
3. Wypełnij formularz i wyślij
4. Sprawdź konsolę deweloperską pod kątem błędów

### Weryfikacja reCAPTCHA:

1. Otwórz Developer Tools
2. Idź do Network tab
3. Wyślij formularz
4. Sprawdź czy jest request do Google reCAPTCHA

### Weryfikacja EmailJS:

1. Sprawdź dashboard EmailJS pod kątem statystyk wysłanych emaili
2. Sprawdź swoją skrzynkę odbiorczą

## 4. Dodatkowe uwagi

### Bezpieczeństwo:

-   Site Key reCAPTCHA może być publiczny
-   Public Key EmailJS może być publiczny
-   Secret Key reCAPTCHA **NIGDY** nie powinien być w kodzie frontend!

### Limity:

-   EmailJS free: 200 emaili/miesiąc
-   reCAPTCHA v3: 1,000,000 weryfikacji/miesiąc za darmo

### Produkcja:

Przed wdrożeniem na produkcję:

1. Dodaj swoją domenę produkcyjną do reCAPTCHA
2. Sprawdź ustawienia EmailJS
3. Przetestuj formularz na domenie docelowej

## 5. Troubleshooting

**Błąd: "reCAPTCHA not loaded"**

-   Sprawdź Site Key
-   Sprawdź czy skrypt reCAPTCHA się załadował
-   Sprawdź domenę w ustawieniach reCAPTCHA

**Emails nie dochodzą:**

-   Sprawdź spam/junk folder
-   Zweryfikuj Template ID i Service ID
-   Sprawdź ustawienia EmailJS service
-   Sprawdź dashboard EmailJS pod kątem błędów
