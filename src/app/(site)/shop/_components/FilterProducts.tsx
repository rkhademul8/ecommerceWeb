import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface FilterState {
  brands: string[];
  sizes: string[];
  vintage: number[];
  minPrice: string;
  maxPrice: string;
}

interface Brand {
  name: string;
  count: number;
}

interface VintageYear {
  year: number;
  count: number;
}

const FilterProducts: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    brand: true,
    color: false,
    size: true,
    vintage: true,
    price: true,
    other: false,
  });

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    sizes: [],
    vintage: [],
    minPrice: "",
    maxPrice: "",
  });

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
    };

  const handleCheckboxChange = (
    category: keyof FilterState,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]:
        Array.isArray(prev[category]) && prev[category].includes(value)
          ? prev[category].filter((item: any) => item !== value)
          : [...(prev[category] as any[]), value],
    }));
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePrice = () => {
    console.log("Price filter updated:", filters.minPrice, filters.maxPrice);
    // Add your price filter logic here
  };

  const brands: Brand[] = [{ name: "OFS", count: 1 }];

  const sizes: string[] = ["L"];
  const vintageYears: VintageYear[] = [{ year: 1991, count: 1 }];

  return (
    <Box className="filter-sidebar">
      {/* Brand Filter */}
      <Accordion
        expanded={expanded.brand}
        onChange={handleAccordionChange("brand")}
        className="filter-accordion"
        disableGutters
        elevation={0}
      >
        <AccordionSummary
          expandIcon={expanded.brand ? <RemoveIcon /> : <AddIcon />}
          aria-controls="brand-content"
          id="brand-header"
        >
          <Typography className="filter-title">Brand</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand.name}
                control={
                  <Checkbox
                    checked={filters.brands.includes(brand.name)}
                    onChange={() => handleCheckboxChange("brands", brand.name)}
                    size="small"
                  />
                }
                label={`${brand.name} (${brand.count})`}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Color Filter */}
      <Accordion
        expanded={expanded.color}
        onChange={handleAccordionChange("color")}
        className="filter-accordion"
        disableGutters
        elevation={0}
      >
        <AccordionSummary
          expandIcon={expanded.color ? <RemoveIcon /> : <AddIcon />}
          aria-controls="color-content"
          id="color-header"
        >
          <Typography className="filter-title">Color</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" className="empty-text">
            No color options available
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Size Filter */}
      <Accordion
        expanded={expanded.size}
        onChange={handleAccordionChange("size")}
        className="filter-accordion"
        disableGutters
        elevation={0}
      >
        <AccordionSummary
          expandIcon={expanded.size ? <RemoveIcon /> : <AddIcon />}
          aria-controls="size-content"
          id="size-header"
        >
          <Typography className="filter-title">Size</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {sizes.map((size) => (
              <FormControlLabel
                key={size}
                control={
                  <Checkbox
                    checked={filters.sizes.includes(size)}
                    onChange={() => handleCheckboxChange("sizes", size)}
                    size="small"
                  />
                }
                label={`${size} (1)`}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Price Filter */}
      {/* <Accordion
        expanded={expanded.price}
        onChange={handleAccordionChange("price")}
        className="filter-accordion"
        disableGutters
        elevation={0}
      >
        <AccordionSummary
          expandIcon={expanded.price ? <RemoveIcon /> : <AddIcon />}
          aria-controls="price-content"
          id="price-header"
        >
          <Typography className="filter-title">Price</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="price-filter">
            <TextField
              placeholder="Min."
              size="small"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange("minPrice", e.target.value)}
              className="price-input"
              variant="outlined"
            />
            <TextField
              placeholder="Max."
              size="small"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
              className="price-input"
              variant="outlined"
            />
            <Button
              variant="contained"
              className="update-button"
              onClick={handleUpdatePrice}
            >
              Update
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion> */}
    </Box>
  );
};

export default FilterProducts;
