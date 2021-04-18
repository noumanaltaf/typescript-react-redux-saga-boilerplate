import React from 'react';
import { useLocation } from 'react-router';
import DashboardLayout from '../common/DashboardLayout';
import { IUsersDetailProps } from './UserDetail.interface';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '0 auto'
    },
    media: {
        height: 500,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function UserDetailPage(props: IUsersDetailProps) {
    const { selectedUser, isLoading, fetchUser } = props;
    const [loading, setLoading] = React.useState(false);

    const query = useQuery() as any;
    const classes = useStyles();

    React.useEffect(
        () => {
            const Id = query.get('Id');

            if (Id) {
                fetchUser(Id);
            }
        },
        []
    );

    React.useEffect(
        () => {
            setLoading(isLoading);
        },
        [isLoading]
    );

    return (
        <DashboardLayout>
            {
                loading ? (
                    <Backdrop className={classes.backdrop} open={loading} >
                        <CircularProgress color="inherit" />
                    </Backdrop>) : (
                    <Card className={classes.root}>
                        <CardMedia
                            className={classes.media}
                            image={selectedUser.avatar}
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {`${selectedUser.first_name} ${selectedUser.last_name}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {selectedUser.text}
                            </Typography>
                        </CardContent>
                    </Card>)
            }

        </DashboardLayout >
    );
}