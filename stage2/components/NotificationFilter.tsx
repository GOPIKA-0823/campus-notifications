import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Paper,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

interface NotificationFilterProps {
  selectedType: string | 'all';
  onTypeChange: (type: string) => void;
  topN: number;
  onTopNChange: (n: number) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const NotificationFilter: React.FC<NotificationFilterProps> = ({
  selectedType,
  onTypeChange,
  topN,
  onTopNChange,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: '#fafafa',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          alignItems: 'flex-end',
        }}
      >
        {/* Type Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="type-filter-label">
            <FilterListIcon sx={{ mr: 1, fontSize: 18 }} />
            Filter by Type
          </InputLabel>
          <Select
            labelId="type-filter-label"
            value={selectedType}
            label="Filter by Type"
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        {/* Top N Selector */}
        <FormControl fullWidth size="small">
          <InputLabel id="topn-label">Top Notifications</InputLabel>
          <Select
            labelId="topn-label"
            value={topN}
            label="Top Notifications"
            onChange={(e) => onTopNChange(e.target.value as number)}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
            <MenuItem value={50}>Top 50</MenuItem>
          </Select>
        </FormControl>

        {/* Refresh Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={isLoading}
          fullWidth
          sx={{
            height: '40px',
          }}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>

        {/* Info */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
          <Button variant="text" disabled fullWidth size="small">
            Updated: {new Date().toLocaleTimeString()}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NotificationFilter;
