/*!
 * Advanced Password Generator
 * Copyright (c) 2025 Mahmoud Ashraf (SNO7E)
 * MIT License - https://github.com/SNO7E-G
 *
 * External APIs and Technologies Used:
 * - HaveIBeenPwned API (https://haveibeenpwned.com/API/v3)
 *   Used for checking password breaches with k-Anonymity
 * 
 * - Web Crypto API
 *   Used for SHA-1 hashing in password breach checks
 *
 * Features:
 * - Multiple password generation algorithms
 * - Real-time strength analysis
 * - Password breach checking
 * - Dark/Light theme with persistence
 * - Accessibility support
 * - Mobile-responsive design
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const customSymbolsInput = document.getElementById('customSymbols');
    const generateButton = document.getElementById('generate');
    const copyButton = document.getElementById('copy');
    const passwordField = document.getElementById('password');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const themeToggle = document.getElementById('themeToggle');
    const historyList = document.getElementById('historyList');
    const clearHistoryButton = document.getElementById('clearHistory');
    const algorithmSelect = document.getElementById('algorithm');
    const patternInput = document.getElementById('patternInput');
    const customPattern = document.getElementById('customPattern');
    const excludeSimilar = document.getElementById('excludeSimilar');
    const breachCheck = document.getElementById('breachCheck');
    const validationRules = document.querySelectorAll('.rule');

    // Initialize theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    // Initialize password history
    let passwordHistory = JSON.parse(sessionStorage.getItem('passwordHistory') || '[]');
    updateHistoryList();

    // Button click animation handler
    const addClickAnimation = (button) => {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 300);
    };

    // Password generation algorithms
    const algorithms = {
        random: generateRandomPassword,
        memorable: generateMemorablePassword,
        pronounceable: generatePronounceablePassword,
        pattern: generatePatternPassword
    };

    // Character sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+[]{}|;:,.<>?',
        similar: 'il1Lo0O',
        vowels: 'aeiou',
        consonants: 'bcdfghjklmnpqrstvwxyz'
    };

    // Event Listeners
    lengthSlider.addEventListener('input', updateLengthValue);
    generateButton.addEventListener('click', (e) => {
        addClickAnimation(e.target);
        generatePassword();
    });
    copyButton.addEventListener('click', (e) => {
        addClickAnimation(e.target);
        copyToClipboard();
    });
    themeToggle.addEventListener('click', (e) => {
        addClickAnimation(e.target);
        toggleTheme();
    });
    clearHistoryButton.addEventListener('click', (e) => {
        addClickAnimation(e.target);
        clearHistory();
    });
    algorithmSelect.addEventListener('change', () => {
        patternInput.classList.toggle('hidden', algorithmSelect.value !== 'pattern');
        if (algorithmSelect.value === 'pattern' && !customPattern.value) {
            customPattern.value = 'Aa##**';
        }
    });

    // Theme toggle
    function toggleTheme() {
        const theme = document.body.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }

    // Update length value display
    function updateLengthValue() {
        lengthValue.textContent = lengthSlider.value;
        // Add visual feedback for slider movement
        lengthValue.style.transform = 'scale(1.2)';
        setTimeout(() => lengthValue.style.transform = 'scale(1)', 200);
    }

    function generateRandomPassword() {
        const length = parseInt(lengthSlider.value);
        let availableChars = '';
        const selectedSets = [];

        if (uppercaseCheckbox.checked) selectedSets.push('uppercase');
        if (lowercaseCheckbox.checked) selectedSets.push('lowercase');
        if (numbersCheckbox.checked) selectedSets.push('numbers');
        if (symbolsCheckbox.checked) selectedSets.push('symbols');

        if (selectedSets.length === 0) {
            return 'Select at least one option';
        }

        // Build character pool
        selectedSets.forEach(set => {
            availableChars += charSets[set];
        });

        // Add custom symbols
        if (customSymbolsInput.value) {
            availableChars += customSymbolsInput.value;
        }

        // Remove similar characters if option is checked
        if (excludeSimilar.checked) {
            availableChars = Array.from(availableChars)
                .filter(char => !charSets.similar.includes(char))
                .join('');
        }

        // Ensure at least one character from each selected set
        let password = selectedSets.map(set => {
            const chars = charSets[set];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        // Fill remaining length with random characters
        while (password.length < length) {
            password += availableChars[Math.floor(Math.random() * availableChars.length)];
        }

        // Shuffle password
        return Array.from(password)
            .sort(() => Math.random() - 0.5)
            .join('');
    }

    function generateMemorablePassword() {
        const words = [
            'apple', 'banana', 'cherry', 'date', 'elder', 'fig', 'grape',
            'honey', 'iris', 'jam', 'kiwi', 'lemon', 'mango', 'nut',
            'olive', 'peach', 'quince', 'rose', 'sage', 'thyme'
        ];
        
        const word = words[Math.floor(Math.random() * words.length)];
        const number = Math.floor(Math.random() * 100);
        const symbol = charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
        
        return word.charAt(0).toUpperCase() + word.slice(1) + number + symbol;
    }

    function generatePronounceablePassword() {
        const length = Math.min(parseInt(lengthSlider.value), 12);
        let password = '';
        
        while (password.length < length) {
            // Add a consonant
            password += charSets.consonants[Math.floor(Math.random() * charSets.consonants.length)];
            if (password.length < length) {
                // Add a vowel
                password += charSets.vowels[Math.floor(Math.random() * charSets.vowels.length)];
            }
        }

        // Capitalize first letter
        password = password.charAt(0).toUpperCase() + password.slice(1);
        
        // Add a number and symbol if needed
        if (numbersCheckbox.checked) {
            password += Math.floor(Math.random() * 10);
        }
        if (symbolsCheckbox.checked) {
            password += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
        }

        return password;
    }

    function generatePatternPassword(pattern = customPattern.value) {
        if (!pattern) return 'Please specify a pattern';

        const patternMap = {
            'A': charSets.uppercase,
            'a': charSets.lowercase,
            '#': charSets.numbers,
            '*': charSets.symbols
        };

        return Array.from(pattern).map(char => {
            const charSet = patternMap[char];
            if (!charSet) return char;
            return charSet[Math.floor(Math.random() * charSet.length)];
        }).join('');
    }

    // Enhanced password generation with selected algorithm
    function generatePassword() {
        const algorithm = algorithmSelect.value;
        const password = algorithms[algorithm]();
        
        if (password === 'Select at least one option' || password === 'Please specify a pattern') {
            passwordField.value = password;
            updateStrengthMeter('');
            return;
        }

        passwordField.value = password;
        updateStrengthMeter(password);
        checkPasswordBreach(password);
        addToHistory(password);
        validatePassword(password);

        // Add visual feedback
        passwordField.classList.add('pulse');
        setTimeout(() => passwordField.classList.remove('pulse'), 300);
    }

    // Check if password has been exposed in data breaches
    async function checkPasswordBreach(password) {
        breachCheck.classList.remove('hidden', 'safe', 'warning', 'danger');
        breachCheck.classList.add('checking');
        breachCheck.textContent = 'Checking password security...';

        try {
            // Get first 5 characters of SHA-1 hash
            const hash = await sha1(password);
            const prefix = hash.substring(0, 5);
            const suffix = hash.substring(5).toUpperCase();

            // Query the API
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            const text = await response.text();
            
            // Check if password hash suffix appears in results
            const breachCount = text.split('\n')
                .find(line => line.startsWith(suffix))
                ?.split(':')[1] || 0;

            breachCheck.classList.remove('checking');
            if (breachCount === 0) {
                breachCheck.textContent = '✓ Password hasn\'t been exposed in data breaches';
                breachCheck.classList.add('safe');
            } else {
                breachCheck.textContent = `⚠️ Password found in ${breachCount} data breaches`;
                breachCheck.classList.add(breachCount > 10 ? 'danger' : 'warning');
            }
        } catch (error) {
            breachCheck.textContent = 'Could not check password security';
            breachCheck.classList.remove('checking');
        }
    }

    // SHA-1 hash function for password breach check
    async function sha1(str) {
        const msgBuffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Validate password against rules
    function validatePassword(password) {
        const rules = {
            lengthRule: password.length >= 8,
            uppercaseRule: /[A-Z]/.test(password),
            lowercaseRule: /[a-z]/.test(password),
            numberRule: /[0-9]/.test(password),
            symbolRule: /[^A-Za-z0-9]/.test(password)
        };

        Object.entries(rules).forEach(([ruleId, isValid]) => {
            const ruleElement = document.getElementById(ruleId);
            ruleElement.classList.toggle('valid', isValid);
            ruleElement.classList.toggle('invalid', !isValid);
            ruleElement.textContent = `${isValid ? '✓' : '✗'} ${ruleElement.textContent.slice(2)}`;
        });
    }

    // Enhanced strength meter with more detailed analysis
    function updateStrengthMeter(password) {
        if (!password) {
            strengthBar.style.width = '0%';
            strengthBar.className = '';
            strengthText.textContent = 'Not generated';
            return;
        }

        const checks = {
            length: {
                score: password.length >= 12 ? (password.length >= 16 ? 2 : 1) : 0,
                max: 2
            },
            uppercase: {
                score: /[A-Z]/.test(password) ? (/(?=.*[A-Z].*[A-Z])/.test(password) ? 2 : 1) : 0,
                max: 2
            },
            lowercase: {
                score: /[a-z]/.test(password) ? (/(?=.*[a-z].*[a-z])/.test(password) ? 2 : 1) : 0,
                max: 2
            },
            numbers: {
                score: /[0-9]/.test(password) ? (/(?=.*[0-9].*[0-9])/.test(password) ? 2 : 1) : 0,
                max: 2
            },
            symbols: {
                score: /[^A-Za-z0-9]/.test(password) ? (/(?=.*[^A-Za-z0-9].*[^A-Za-z0-9])/.test(password) ? 2 : 1) : 0,
                max: 2
            },
            variety: {
                score: new Set(password).size > password.length * 0.7 ? 2 : 1,
                max: 2
            }
        };

        const totalScore = Object.values(checks).reduce((sum, check) => sum + check.score, 0);
        const maxScore = Object.values(checks).reduce((sum, check) => sum + check.max, 0);
        const strengthPercentage = (totalScore / maxScore) * 100;

        strengthBar.style.width = strengthPercentage + '%';
        let strengthLabel = 'Weak';
        strengthBar.className = '';

        if (strengthPercentage >= 80) {
            strengthLabel = 'Strong';
            strengthBar.classList.add('strong');
        } else if (strengthPercentage >= 50) {
            strengthLabel = 'Medium';
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('weak');
        }

        // Detailed feedback
        const details = [];
        if (password.length < 12) details.push('Consider using at least 12 characters');
        if (!(/[A-Z]/.test(password))) details.push('Add uppercase letters');
        if (!(/[a-z]/.test(password))) details.push('Add lowercase letters');
        if (!(/[0-9]/.test(password))) details.push('Add numbers');
        if (!(/[^A-Za-z0-9]/.test(password))) details.push('Add special characters');

        strengthText.textContent = `Password strength: ${strengthLabel}${details.length ? ' - ' + details[0] : ''}`;
    }

    // Copy to clipboard with enhanced feedback
    function copyToClipboard() {
        if (!passwordField.value || passwordField.value === 'Select at least one option') {
            return;
        }
        
        navigator.clipboard.writeText(passwordField.value).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            copyButton.style.backgroundColor = 'var(--strong-color)';
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.style.backgroundColor = '';
            }, 1500);
        });
    }

    // Password history management
    function addToHistory(password) {
        if (!password || password === 'Select at least one option') {
            return;
        }

        passwordHistory.unshift(password);
        if (passwordHistory.length > 5) {
            passwordHistory.pop();
        }
        sessionStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
        updateHistoryList();
    }

    function updateHistoryList() {
        historyList.innerHTML = '';
        passwordHistory.forEach(password => {
            const li = document.createElement('li');
            
            const passwordText = document.createElement('span');
            passwordText.textContent = password;
            
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.classList.add('secondary-button');
            copyBtn.addEventListener('click', (e) => {
                addClickAnimation(e.target);
                navigator.clipboard.writeText(password).then(() => {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.backgroundColor = 'var(--strong-color)';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.style.backgroundColor = '';
                    }, 1500);
                });
            });

            li.appendChild(passwordText);
            li.appendChild(copyBtn);
            historyList.appendChild(li);
        });
    }

    function clearHistory() {
        passwordHistory = [];
        sessionStorage.removeItem('passwordHistory');
        updateHistoryList();
    }

    // Initialize
    updateLengthValue();
    validatePassword('');
});