import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExampleWithLocalizationProvider from "../Components/DataGrid/DataGrid";
import './App.css';
import "@fontsource/vazirmatn";

const THEME = createTheme({
  typography: {
   "fontFamily": "Vazirmatn",
   "fontSize": 14,
  }
});

function App() {
  return (
    <ThemeProvider theme={THEME}>
    <div className="container">
      <div className="">
      <ExampleWithLocalizationProvider />
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
