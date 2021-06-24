import React from 'react'
import styles from "../styles/splitScreen.css"
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function RightPane(props) {

    let data = ["text1", "name", "text2", "publication"]

    let displayScraped = (data) => {
        let elems = []
        for (let i = 0; i < data.length; i += 2) {
            elems.push(
                <SimpleCard text={data[i]} classifcation={data[i + 1]} />
            )
        }
        return elems
    }

    return (
        <div className={styles.pane} >
            {displayScraped(data)}
        </div>
    )
}

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        margin: '10px'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

function SimpleCard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.pos} color="textSecondary">
                    {props.classifcation}
                </Typography>

                <Typography className={classes.title} color="" gutterBottom>
                    Text: {props.text}
                </Typography>
            </CardContent>

        </Card>
    );
}