import React, {useState} from 'react'
import styles from "../styles/splitScreen.css"
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card, CardActions, CardContent, Button, Typography, Box, Popover } from '@material-ui/core';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

export default function RightPane(props) {


    let displayScraped = (data) => {
        let elems = []
        for (let i = 0; i < data.length; i++) {
            elems.push(
                <SimpleCard text={data[i][0]} label={data[i][1]} />
            )
        }
        return elems
    }

    return (
        <div className={styles.pane}>
            {displayScraped(props.conceptTerms)}
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
                <LabelField classes={classes} text={props.text} label={props.label} />

                <Typography className={classes.title} color="" gutterBottom>
                    {props.text}
                </Typography>
            </CardContent>

        </Card>
    );
}

function LabelField(props) {

    return (
        <Typography className={props.classes.pos} color="textSecondary">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                {props.label}
                <PopoverPopupState text={props.text} label={props.label} />
            </div>

        </Typography >
    )
}

function PopoverPopupState(props) {
    return (
        <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
                <div>
                    <Button color="primary" {...bindTrigger(popupState)}>
                        Update Label
                    </Button>
                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Box p={2}>
                            <UpdateLabel text={props.text} label={props.label} />
                        </Box>
                    </Popover>
                </div>
            )}
        </PopupState>
    );
}

function UpdateLabel(props) {
    const backendURL = "http://localhost:8000/api/"

    // sends new label to backend
    const update = (text,label) => {
        var data = JSON.stringify({ "text": text, "label" : label });

        var config = {
            method: 'post',
            url: 'http://localhost:8000/api/updateLabel',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                // setRawHTML(response.data.rawHTML)
                // setConceptTerms(response.data.conceptTerms)
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    
    const [newLabel, setNewLabel] = useState(props.label);

    return (
        <span>
            {/* <div>Current: <i>{props.label}</i></div>
            <br></br> */}
            <div>
                Label: <br></br>
                <TextField id="standard-basic" label="Update" value={newLabel} onChange={(e) => { setNewLabel(e.target.value) }}/>
            </div>
            <br></br>

            <Button variant="contained" color="primary" onClick={() => {update(props.text, newLabel)}}>
                Verify
            </Button>

        </span>
    )
}