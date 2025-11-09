// ...existing code...
module.exports = {
  // ...existing config...
  theme: {
    extend: {
      keyframes: {
        fogMove: {
          '0%': { 'background-position': '0 0' },
          '100%': { 'background-position': '1000px 0' },
        },
        mist: {
          '0%': { opacity: '0.06', transform: 'translateY(0)' },
          '50%': { opacity: '0.12', transform: 'translateY(-6px)' },
          '100%': { opacity: '0.06', transform: 'translateY(0)' },
        },
      },
      animation: {
        fogMove: 'fogMove 60s linear infinite',
        mist: 'mist 10s ease-in-out infinite alternate',
      },
    },
  },
  
	extend: {
	colors: {
		mist: '#7A8C99',
		slate: '#2B2F33',
		mountain: '#3E4A52',
		thunder: '#8F9AA3',
		rune: '#D4AF37', // gold accent
	},
	backgroundImage: {
		'misty-mountain': "url('/images/misty_mountains.jpg')",
	},
	}
};
