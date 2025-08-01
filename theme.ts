
export const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  card: '#f5f5f5',
  border: '#ddd',
  assistanceCardTheme: {
    borderWidth: 1,
    borderColor: '#fff',
    background: 'green',
  }
};

export const darkTheme = {
  background: '#000',
  text: '#ffffff',
  card: '#232323',
  // card: '#1e1e1e',
  border: '#444',
  assistanceCardTheme: {
    borderWidth: 1,
    borderColor: '#fff',
    background: 'blue',
    border: 1,
  }
};


// To improve dark mode, update your theme.ts darkTheme like this:
// background: "#181818"
// card: "#232323"
// text: "#f5f5f5"
// border: "#444"
// And in your Settings component, use theme.card and theme.text for backgrounds and text colors.
