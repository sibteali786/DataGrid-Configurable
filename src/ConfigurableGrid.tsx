import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export interface ColumnConfig {
  label: string;
  key: string;
  type: string;
  // To allow indexing of the ColumnConfig props
  [key: string]: any;
}

export interface GridProps {
  defaultColumnConfig: ColumnConfig[];
}

const ConfigurableGrid: React.FC<GridProps> = ({ defaultColumnConfig }) => {
  // Different States
  const [apiUrl, setApiUrl] = useState("");
  const [columnConfig, setColumnConfig] = useState(defaultColumnConfig);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 600);
  const [titleKey, setTitleKey] = useState("");
  const [subtitleKey, setSubTitleKey] = useState("");

  // useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 600);
      // Checking if on mobileView
    };
    window.addEventListener("resize", handleResize);
    if (isMobileView) {
      if (columnConfig.length > 1) {
        setTitleKey(columnConfig[0].key);
        setSubTitleKey(columnConfig[1].key);
      }
    }
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetching data from given API URL
  const fetchData = () => {
    setIsLoading(true);
    if (apiUrl.length > 0) {
      axios
        .get(apiUrl)
        .then((response) => {
          setData(response?.data?.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  };

  const handleApiUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(event.target.value);
  };

  const handleColumnConfigChange = (
    index: number,
    key: string,
    value: string
  ) => {
    const newColumnConfig = [...columnConfig];
    newColumnConfig[index][key] = value;
    setColumnConfig(newColumnConfig);
  };

  const handleAddColumn = () => {
    setColumnConfig([
      ...columnConfig,
      { label: "Label", key: "Key", type: "string" },
    ]);
  };

  const handleRemoveColumn = (index: number) => {
    const newColumnConfig = [...columnConfig];
    newColumnConfig.splice(index, 1);
    setColumnConfig(newColumnConfig);
  };

  const getTitle = (row: any) => {
    if (titleKey) {
      return row[titleKey];
    }
    return row[columnConfig[0].key];
  };

  const getSubtitle = (row: any) => {
    if (subtitleKey) {
      return row[subtitleKey];
    }
    return row[columnConfig[1].key];
  };

  const handleTitleChange = (event: any) => {
    setTitleKey(event.target.value as string);
  };

  const handleSubtitleChange = (event: any) => {
    setSubTitleKey(event.target.value as string);
  };
  const handleFetchData = () => {
    fetchData();
  };

  return (
    <Grid container className="flex flex-col justify-center px-[4rem]">
      <h1 className="text-2xl sm:text-3xl">Configurable Grid</h1>
      <Grid container item xs={12} className="my-2">
        <p className="text-gray-700 mb-2">Enter the Api URL to retrieve data</p>
        <TextField
          fullWidth
          variant="outlined"
          label="API URL"
          value={apiUrl}
          onChange={handleApiUrlChange}
        />
        <Button
          variant="contained"
          className="bg-slate-700 mt-2"
          onClick={handleFetchData}
        >
          Fetch Data
        </Button>
      </Grid>
      {isLoading ? (
        <Grid
          container
          style={{ height: "100vh" }}
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      ) : isMobileView ? (
        <Grid container item xs={12} mt={2}>
          <div className="block sm:hidden">
            <form>
              <div className="space-x-2">
                <p>Chose any column to set as tile and subtitle</p>
                <div className="flex flex-col items-start">
                  <InputLabel className="my-2">Title</InputLabel>
                  <Select
                    value={titleKey}
                    onChange={(e) => handleTitleChange(e)}
                  >
                    {data.length > 0 ? (
                      Object.keys(data[0]).map((field, index) => (
                        <MenuItem key={index} value={field}>
                          {field}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value={titleKey}>{titleKey}</MenuItem>
                    )}
                  </Select>
                  <InputLabel className="my-2">Subtitle</InputLabel>
                  <Select
                    value={subtitleKey}
                    onChange={(e) => handleSubtitleChange(e)}
                  >
                    {data.length > 0 ? (
                      Object.keys(data[0]).map((field, index) => (
                        <MenuItem key={index} value={field}>
                          {field}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value={subtitleKey}>{subtitleKey}</MenuItem>
                    )}
                  </Select>
                </div>
              </div>
            </form>
            <List>
              {data.map((row: any) => (
                <ListItem
                  key={row.id}
                  className="border-2 border-black my-2 rounded-md hover:bg-slate-400 hover:cursor-pointer transition-all ease-in-out delay-120 hover:text-white"
                >
                  <ListItemText
                    primary={getTitle(row)}
                    secondary={getSubtitle(row)}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
      ) : (
        <>
          <Grid container item xs={12} mt={2}>
            <p className="text-gray-700 mb-2">
              Select Column Label, key and DataType
            </p>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow className="overflow-scroll">
                    {columnConfig.map((column, index) => (
                      <TableCell key={index} className="min-w-[200px]">
                        <TextField
                          className="my-2"
                          fullWidth
                          variant="outlined"
                          label="Label"
                          value={column.label}
                          onChange={(event) =>
                            handleColumnConfigChange(
                              index,
                              "label",
                              event.target.value
                            )
                          }
                        />
                        <TextField
                          className="my-2"
                          fullWidth
                          variant="outlined"
                          label="Column Key"
                          value={column.key}
                          onChange={(event) =>
                            handleColumnConfigChange(
                              index,
                              "key",
                              event.target.value
                            )
                          }
                        />
                        <TextField
                          className="my-2"
                          fullWidth
                          variant="outlined"
                          label="Column Type"
                          value={column.type}
                          onChange={(event) =>
                            handleColumnConfigChange(
                              index,
                              "type",
                              event.target.value
                            )
                          }
                        />
                        <IconButton onClick={() => handleRemoveColumn(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton onClick={handleAddColumn}>
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row: any, rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      <TableCell>{getTitle(row)}</TableCell>
                      <TableCell>{getSubtitle(row)}</TableCell>
                      {columnConfig.slice(2).map((column, index) => (
                        <TableCell key={index}>{row[column.key]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ConfigurableGrid;
