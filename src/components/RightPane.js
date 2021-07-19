import React, { useState, useEffect } from 'react'
import styles from "../styles/splitScreen.css"
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card, CardActions, CardContent, Button, Typography, Box, Popover, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';


//need to make this dynamic later
const sizeOfDashboard = 300

//todo make into an api
const labels = ["Education", "Biography", "Research Interest", "Award", "Other"]

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
    dashboardCard: {
        height: (sizeOfDashboard) + 'px',
        position: 'fixed',
        marginTop: (-1 * sizeOfDashboard) + 'px',
        // width: '80%',
        zIndex: '2',
        margin: '5px'
    }
});


export default function RightPane(props) {

    
    // let metrics = {
    //     correct: 0,
    //     incorrect: 0,
    // }

    const [metrics, setMetrics] = useState({accuracy: {correct: 0, incorrect: 0}});
 

    const updateDashboard = (predicted, actual) => {

        //super inneeficient -> change to reducer???
        const oldMetrics = JSON.parse(JSON.stringify(metrics));

        if (predicted === actual) {
            oldMetrics.accuracy.correct++
        } else {
            oldMetrics.accuracy.incorrect++
        }

        //update store for confusion matrix
        if (oldMetrics[actual] == undefined) {
           oldMetrics[actual] = {}
        }
        oldMetrics[actual][predicted] = (oldMetrics[actual][predicted] + 1) || 1;

        setMetrics(oldMetrics)
        // alert(metrics.accuracy.correct)
    }

    const displayScraped = (data) => {
        let elems = []
        for (let i = 0; i < data.length; i++) {
            elems.push(
                <SimpleCard text={data[i][0]} label={data[i][1]} updateDashboard={updateDashboard}/>
            )
        }
        return elems
    }

    return (
        <div className={styles.pane}>
            {/* <div style={{ position: 'fixed', marginLeft: '30px', marginTop: '-100px' }}>
                hi2
            </div> */}
            <Metrics metrics={metrics}/>
            <div style={{ marginTop: (sizeOfDashboard) + 'px' }}>
                {displayScraped(props.conceptTerms)}
            </div>
        </div>
    )
}

function Metrics(props) {
    const classes = useStyles();

    useEffect(() => {
        // effect
        // return () => {
        //     cleanup
        // }
    }, [props.metrics])

    return (
        <Card className={classes.dashboardCard}>
            {/* 
            Need to display accuracy
            - accuracies for each label???
        */}
        {JSON.stringify(props.metrics)}
        <br></br>
        <h3>Accuracy: {props.metrics.accuracy.correct / (props.metrics.accuracy.correct + props.metrics.accuracy.incorrect + .01) * 100}%</h3>
        </Card>
    )
}

function SimpleCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <LabelField classes={classes} text={props.text} label={props.label} updateDashboard={props.updateDashboard}/>

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
                <PopoverPopupState text={props.text} label={props.label} updateDashboard={props.updateDashboard}/>
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
                        Verify Label
                    </Button>
                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: 'left',
                        }}
                    >
                        <Box p={2}>
                            <UpdateLabel text={props.text} label={props.label} updateDashboard={props.updateDashboard}/>
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
    const update = (text, label) => {
        var data = JSON.stringify({ "text": text, "label": label });

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

    const classes = useStyles();
    const [newLabel, setNewLabel] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event) => {
        setNewLabel(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <span>
            {/* <div>Current: <i>{props.label}</i></div>
            <br></br> */}
            {/* <div>
                Label: <br></br>
                <TextField id="standard-basic" label="Update" value={newLabel} onChange={(e) => { setNewLabel(e.target.value) }} />
            </div> */}
            <div>
                Original Label: {props.label}
            </div>
            <br></br>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">Label</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={newLabel}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {labels.map((val) => {
                        return <MenuItem value={val}>{val}</MenuItem>
                    })}
                </Select>

                <br></br>

                <Button variant="contained" color="primary" onClick={() => { update(props.text, newLabel); props.updateDashboard(props.label, props.label) }}>
                    Correct
                </Button>
                <br></br>
                <Button variant="contained" color="secondary" onClick={() => { update(props.text, newLabel); props.updateDashboard(props.label, newLabel) }}>
                    Update
                </Button>
            </FormControl>

        </span>
    )
}