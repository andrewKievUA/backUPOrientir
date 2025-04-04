import React from 'react';

import { Typography, Grid, List, ListItem, ListItemText, Paper } from '@mui/material';


import questions from './questionsData';

const VerbConjugations = () => {
    return (
        <div>

      <Grid container spacing={2}>
        {questions.help.map(([pronouns, conjugation]) => (
          <Grid item xs={2} key={pronouns.join(',')}>
            <Paper variant="outlined" sx={{  backgroundColor: 'transparent' }}>
              <ListItem>
                <ListItemText
                  primary={pronouns}
                  secondary={
                    <Typography component="div">
                     {conjugation}
                    </Typography>
                  }
                />
               
              </ListItem>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
    );
};

export default VerbConjugations;