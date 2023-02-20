import React from "react";
import { CardContent, Skeleton, Divider, Grid, Card } from "@mui/material";

interface ITableLoader {
  noBorder?: boolean
}

const SkeletonComponent = () => (
  <Skeleton
    variant="rectangular"
    width={160}
    height={20}
    sx={{ borderRadius: "30px" }}
  />
);

const SkeletonBox = () => (
  <Skeleton
    variant="rectangular"
    width={60}
    height={60}
    sx={{ borderRadius: "12px" }}
  />
);

const SkeletonRow = () => {
  const rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push(
      <Grid mr={1} item lg={2}>
        <SkeletonComponent />
      </Grid>
    );
  }

  return <>{rows}</>;
};

const SkeletonRows = () => {
  const rows = [];

  for (let i = 0; i < 5; i++) {
    rows.push(
      <Grid container sx={{ mb: 4, mt: 3 }}>
        <Grid mr={3}>
          <SkeletonBox />
        </Grid>
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
        width: "66%"
      }}
    >
      <CardContent sx={{ padding: "0px" }}>
        <Grid display="flex" justifyContent="space-between">
          <SkeletonComponent />
          <Skeleton
            variant="rectangular"
            width={90}
            height={20}
            sx={{ borderRadius: "30px" }}
          />
        </Grid>
        <Divider sx={{ mt: 3, mb: 3 }} />
        <SkeletonRows />
      </CardContent>
    </Card>
  );
};

export default TableLoader;
