/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: '#0A1628',
                'navy-light': '#112240',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseSlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'pulse-slow': 'pulseSlow 3s infinite',
                'slide-up': 'slideUp 0.3s ease-out',
            }
        },
    },
    plugins: [],
}
