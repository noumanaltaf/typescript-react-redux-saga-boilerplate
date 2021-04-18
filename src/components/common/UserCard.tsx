import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import { IUser } from 'ducks/user/users';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        width: 'fit-content',
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
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

interface IUserCardProps {
    data: IUser;
    onClick?(data: IUser): void;
}

const UserCard = ({ data, onClick }: IUserCardProps) => {
    const classes = useStyles();

    return (
        <Card style={{ margin: 5 }} onClick={() => {
            if (onClick) onClick(data)
        }}>
            <CardActionArea className={classes.root}>
                <Avatar alt="Remy Sharp" src={data.avatar} className={classes.large} />
                <div>
                    <Typography variant="h5" component="h2">
                        {`${data.first_name} ${data.last_name}`}
                    </Typography>
                    <a href={`mailto:${data.email}`} className={classes.pos} color="textSecondary">
                        {data.email}
                    </a>
                </div>
            </CardActionArea>
        </Card >
    );
};

export default UserCard;