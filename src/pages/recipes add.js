import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const Recipes = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: '',
    steps: '',
    cookingTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recipe submitted:', recipe);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: '600px' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Post a Recipe
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            value={recipe.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Cooking Time (minutes)"
            name="cookingTime"
            fullWidth
            value={recipe.cookingTime}
            onChange={handleChange}
            margin="normal"
            type="number"
          />
          <TextField
            label="Ingredients"
            name="ingredients"
            fullWidth
            multiline
            rows={4}
            value={recipe.ingredients}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Preparation Steps"
            name="steps"
            fullWidth
            multiline
            rows={6}
            value={recipe.steps}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
            />
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Post Recipe
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Recipes;