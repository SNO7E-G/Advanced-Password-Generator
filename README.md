# Advanced Password Generator

A sophisticated password generator with multiple algorithms, security checks, and a modern user interface.

## 🔐 Features

- **Multiple Password Generation Algorithms:**
  - Standard Random: Advanced random generation with character distribution
  - Memorable Pattern: Creates passwords using common words + numbers + symbols
  - Pronounceable: Generates readable passwords using vowel-consonant patterns
  - Custom Pattern: Allows custom patterns (e.g., "Aa##**")

- **Advanced Security Features:**
  - Password breach checking using HaveIBeenPwned API
  - Comprehensive strength meter
  - Similar character exclusion (1, l, I, 0, O)
  - Real-time validation rules

- **User Experience:**
  - Dark/Light theme toggle
  - Password history
  - Custom symbol support
  - Visual feedback animations
  - Mobile-responsive design

## 🚀 Live Demo

[View Live Demo](https://sno7e-g.github.io/advanced-password-generator/)

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- HaveIBeenPwned API for security checks

## 📥 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SNO7E-G/advanced-password-generator.git
   ```

2. Open `index.html` in your browser

## 💡 Usage

1. Select your preferred password generation algorithm
2. Customize password requirements:
   - Length (8-32 characters)
   - Character types (uppercase, lowercase, numbers, symbols)
   - Custom symbols
3. Click "Generate Password"
4. Copy the generated password
5. Check password strength and security status

## 🔒 Security Features

- Client-side only - no password transmission
- Uses k-Anonymity for breach checking
- Session storage for temporary history
- No permanent storage of generated passwords

## 🤝 Contributing

Feel free to contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Mahmoud Ashraf (SNO7E)**
- GitHub: [@SNO7E-G](https://github.com/SNO7E-G)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).