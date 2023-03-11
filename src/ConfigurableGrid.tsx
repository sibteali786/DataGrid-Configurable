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
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export interface ColumnConfig {
  label: string;
  key: string;
  type: string;
}

export interface GridProps {
  apiUrl: string;
  columnConfig: ColumnConfig[];
  titleKey?: string;
  subtitleKey?: string;
}

const ConfigurableGrid: React.FC<GridProps> = ({
  apiUrl,
  columnConfig,
  titleKey,
  subtitleKey,
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 600);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
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
  }, [apiUrl]);

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

  if (isLoading) {
    return (
      <Grid
        container
        style={{ height: "100vh" }}
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container className="flex flex-col justify-center !important">
      {isMobileView ? (
        <div className="block sm:hidden">
          <h1 className="my-2 text-xl md:text-3xl ">
            Data Grid As List Mobile View
          </h1>
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
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columnConfig.map((column: ColumnConfig) => (
                  <TableCell key={column.key}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: any) => (
                <TableRow key={row.id}>
                  {columnConfig.map((column: ColumnConfig) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Grid>
  );
};

export default ConfigurableGrid;
