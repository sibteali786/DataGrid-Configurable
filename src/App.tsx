import ConfigurableGrid, { ColumnConfig } from "./ConfigurableGrid";
import "./App.css";
// Roboto Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const columnConfig: ColumnConfig[] = [
  { label: "Name", key: "name", type: "string" },
  { label: "Date", key: "date", type: "date" },
  // { label: "Category", key: "category", type: "string" },
  // { label: "Amount", key: "amount", type: "number" },
  // { label: "Created At", key: "created_at", type: "date" },
];

function App() {
  return (
    <div className="App">
      <ConfigurableGrid defaultColumnConfig={columnConfig} />
    </div>
  );
}

export default App;
