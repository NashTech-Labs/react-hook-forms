import React from "react";
import { CardContent, Skeleton, Divider, Grid, Card } from "@mui/material";

interface ITableLoader {
  noBorder?: boolean
}

const SkeletonComponent = () => (
  <Skeleton
    variant="rectangular"
    width={150}
    height={20}
    sx={{ borderRadius: "30px" }}
  />
);

const SkeletonRow = () => {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    rows.push(
      <Grid item lg={2}>
        <SkeletonComponent />
      </Grid>
    );
  }

  return <>{rows}</>;
};

const SkeletonRows = () => {
  const rows = [];

  for (let i = 0; i < 3; i++) {
    rows.push(
      <Grid container sx={{ mb: 2, mt: 2 }}>
        <SkeletonRow />
      </Grid>
    );
  }

  return <>{rows}</>;
};

const TableLoader = ({ noBorder }: ITableLoader) => {
  return (
    <Card
      sx={{
        border: noBorder ? 'none' : "1px solid #cccccc",
        boxShadow: noBorder ? 'none' : "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        padding: "24px 20px 8px",
      }}
    >
      <CardContent sx={{ padding: "0px" }}>
        <SkeletonComponent />
        <Divider sx={{ mt: 3, mb: 3 }} />
        <SkeletonRows />
      </CardContent>
    </Card>
  );
};

export default TableLoader;
