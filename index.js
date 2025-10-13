import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlantCard from "./PlantCard";
const plantData = [
  {
    id: 1,
    location: "Hellbronn",
    code: "AS02-DR-09-SU",
    riskScore: 91,
    riskLevel: "High",
    category: "Food",
  },
  {
    id: 2,
    location: "Stuttgart",
    code: "ST03-DR-10-BW",
    riskScore: 85,
    riskLevel: "Medium",
    category: "Logistics",
  },
  {
    id: 3,
    location: "Munich",
    code: "MN01-DR-05-BY",
    riskScore: 95,
    riskLevel: "High",
    category: "Chemical",
  },
  {
    id: 4,
    location: "Berlin",
    code: "BL04-DR-12-BB",
    riskScore: 72,
    riskLevel: "Low",
    category: "Food",
  },
  {
    id: 5,
    location: "Hamburg",
    code: "HB05-DR-07-HH",
    riskScore: 88,
    riskLevel: "Medium",
    category: "Automotive",
  },
  {
    id: 6,
    location: "Cologne",
    code: "CG06-DR-15-NR",
    riskScore: 93,
    riskLevel: "High",
    category: "Logistics",
  },
  {
    id: 7,
    location: "Frankfurt",
    code: "FR07-DR-02-HE",
    riskScore: 78,
    riskLevel: "Low",
    category: "Food",
  },
  {
    id: 8,
    location: "Dusseldorf",
    code: "DS08-DR-11-NR",
    riskScore: 82,
    riskLevel: "Medium",
    category: "Chemical",
  },
  {
    id: 9,
    location: "Dresden",
    code: "DD09-DR-06-SN",
    riskScore: 90,
    riskLevel: "High",
    category: "Automotive",
  },
  {
    id: 10,
    location: "Leipzig",
    code: "LP10-DR-03-SN",
    riskScore: 75,
    riskLevel: "Low",
    category: "Logistics",
  },
];

const PlantDistributionCarousel: React.FC = () => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const itemsPerView: number = 3;

  const handleNext = () => {
    // Move forward by 3, but stop when less than 3 cards remain to display.
    setStartIndex((prev) =>
      Math.min(prev + itemsPerView, plantData.length - itemsPerView)
    );
  };

  const handlePrev = () => {
    // Move backward by 3, but stop at index 0.
    setStartIndex((prev) => Math.max(prev - itemsPerView, 0));
  };

  // Slice the data array to get the current set of cards to display
  const currentCards = plantData.slice(startIndex, startIndex + itemsPerView);

  // Check if we are at the end of the list
  const isEnd = startIndex >= plantData.length - itemsPerView;

  return (
    <Box
      sx={{
        width: "95vw",
        mx: "auto",
        mt: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        Plant Risk Distribution
        <IconButton size="small" sx={{ ml: 0.5, color: "text.secondary" }}>
          <Box component="span" sx={{ fontSize: 16 }}>
            ⓘ
          </Box>
        </IconButton>
      </Typography>

      {/* Carousel Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 1,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          minHeight: 250,
        }}
      >
        {/* Left Arrow Button */}
        <IconButton
          onClick={handlePrev}
          disabled={startIndex === 0}
          size="large"
          sx={{
            p: 2,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            borderRadius: 2, // Squared edges as per image
          }}
        >
          <ArrowBackIosIcon fontSize="large" />
        </IconButton>

        {/* Display Cards */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-around",
            overflow: "hidden",
          }}
        >
          {currentCards.map((plant) => (
            <PlantCard key={plant.id} data={plant} />
          ))}
        </Box>

        {/* Right Arrow Button */}
        <IconButton
          onClick={handleNext}
          disabled={isEnd}
          size="large"
          sx={{
            p: 2,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            borderRadius: 2, // Squared edges as per image
          }}
        >
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PlantDistributionCarousel;


import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

const tabNames: string[] = [
  "Business Group",
  "Business Unit",
  "Country",
  "Plant",
];

const ResponsiveTabs: React.FC = () => {
  // Specify the type for the state: number
  const [value, setValue] = useState<number>(3); // 'Plant' is active by default (index 3)

  // Specify the type for the event and newValue (which is number)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "95vw",
        mx: "auto",
        borderBottom: 1,
        borderColor: "divider",
        mt: 2,
        mb: 2,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="Responsive navigation tabs"
        TabIndicatorProps={{
          style: { backgroundColor: "transparent" },
        }}
      >
        {tabNames.map((name, index) => (
          <Tab
            key={name}
            label={name}
            sx={{
              flexGrow: 1,
              minWidth: 0,
              py: 2,
              borderRadius: "6px 6px 0 0",
              // Active State: Blue background, White text
              ...(value === index && {
                backgroundColor: "#1976d2", // Primary Blue
                color: "white",
                fontWeight: "bold",
                border: "1px solid #1976d2",
              }),
              // Inactive State: White background, Black text
              ...(value !== index && {
                backgroundColor: "white",
                color: "black",
                border: "1px solid lightgray",
              }),
              "&:not(:last-child)": {
                marginRight: "-1px", // Collapse borders between tabs
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ResponsiveTabs;
import React from "react";
import {
  Card,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { PlantData } from "../types";

// Define props interface for type safety
interface PlantCardProps {
  data: PlantData;
}

const PlantCard: React.FC<PlantCardProps> = ({ data }) => {
  const score = data.riskScore;

  // MUI color mapping for risk level
  const riskColor =
    data.riskLevel === "High"
      ? "error"
      : data.riskLevel === "Medium"
      ? "warning"
      : "success";
  // Custom color mapping for category, using default MUI colors
  const categoryColor = data.category === "Food" ? "success" : "primary";

  return (
    <Card
      sx={{
        width: 300,
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        textAlign: "left",
        mx: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" component="div" fontWeight="bold">
            {data.location}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.code}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip label={data.riskLevel} color={riskColor} size="small" />
          <Chip label={data.category} color={categoryColor} size="small" />
        </Box>
      </Box>

      {/* Half-Circular Progress Bar */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          my: 2,
        }}
      >
        <Tooltip title={`Risk Score: ${score}%`}>
          <Box
            sx={{
              width: 150,
              height: 75,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Main Progress Bar (Red) */}
            <CircularProgress
              variant="determinate"
              value={score}
              size={150}
              thickness={5}
              sx={{
                color: "red",
                position: "absolute",
                left: 0,
                top: 0,
                transform: "rotate(-90deg)", // Start the arc from the bottom left
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)", // Mask the top half
              }}
            />
            {/* Background Track (Gray) */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={150}
              thickness={5}
              sx={{
                color: "#e0e0e0",
                position: "absolute",
                left: 0,
                top: 0,
                transform: "rotate(-90deg)",
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              }}
            />

            {/* Score Text */}
            <Typography
              variant="h3"
              component="div"
              sx={{
                position: "absolute",
                bottom: 25,
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                color: "red",
              }}
            >
              {score}
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      {/* Lower Labels for the gauge (Simulated) */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: -1 }}>
        <Typography variant="caption" sx={{ ml: 4 }}>
          90
        </Typography>
        <Typography variant="caption" fontWeight="bold">
          Risk Score
        </Typography>
        <Typography variant="caption" sx={{ mr: 4 }}>
          M&M
        </Typography>
      </Box>
    </Card>
  );
};

export default PlantCard;

