import { createTheme, ThemeProvider } from '@mui/material/styles';
import DataGrid from "../Components/DataGrid/DataGrid";
import './App.css';
import "@fontsource/vazirmatn";

const THEME = createTheme({
  typography: {
    "fontFamily": "Vazirmatn",
    "fontSize": 14,
  },
  direction:"rtl"
});

function App() {
  return (
    <ThemeProvider theme={THEME}>
      <div className="container">
        <div className="p-10">
          <h1 className="min-w-full h-10 text-right">صورتحساب ها</h1>
          <DataGrid />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
