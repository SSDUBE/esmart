import React from 'react';
import { Button, Grid, IconButton, Theme, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiTable } from '../components/MuiTable';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { ConfirmiationModal } from '../components/ConfirmitionModal';
import swal from 'sweetalert';
import dayjs from 'dayjs';
import { UserService } from '../services/UserService';
import { FTextField } from '../components/FTextField';
import { MuiModal } from '../components/MuiModal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
  scrumble: Yup.string()
    .required('Scrumble Name is a required field')
    .matches(
      /^[^\s][A-Za-z0-9\s]*[^\s]$/,
      'Scrumble Name cannot include leading and trailing spaces'
    ),
});

interface ITableData {
  word: string;
  wordLength: string;
  createdAt: string;
  scrumbleID: number;
}

interface IColumn {
  id: 'word' | 'wordLength' | 'createdAt' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    backgroundColor: 'rgb(207, 213, 227)',
    width: theme.spacing(3.2),
    height: theme.spacing(3.2),
    borderRadius: 15,
    marginLeft: theme.spacing(1.5),
  },
  icon: {
    width: 17,
    height: 17,
    color: 'rgb(207, 213, 227)',
  },
}));

const columns: readonly IColumn[] = [
  {
    id: 'word',
    label: 'Scrumble',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'wordLength',
    label: 'Word Length',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'createdAt',
    label: 'Created At',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'center',
    format: (value: number) => value.toFixed(2),
  },
];

export const GameSettings = () => {
  const classes = useStyles();
  const [rows, setRows] = React.useState<ITableData[]>([]);
  const [scrumbleName, setDeleteScrumble] = React.useState(false);
  const [scrumbleId, setScrumbleId] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    (async function () {
      try {
        const tempRows: ITableData[] = [];

        const user = new UserService();

        const scrumbles = await user.getScrumbles();

        scrumbles.data.forEach((scrumble: any) => {
          tempRows.push(
            // @ts-ignore
            createData({
              scrumbleID: scrumble.scrumbleID,
              word: scrumble.word,
              wordLength: scrumble.wordLength,
              createdAt: dayjs(scrumble.createdAt).format('YYYY/MM/DD mm:ss'),
            })
          );
        });

        setRows(tempRows);
      } catch (err) {
        console.log('something went wrong loading ', err);
      }
    })();
  }, []);

  async function handleAction() {
    try {
      const tempRows = [...rows];
      const user = new UserService();

      const index = tempRows.findIndex((row) => row.scrumbleID === scrumbleId);

      const res = await user.dealeteScrumble(tempRows[index].scrumbleID.toString());

      if (res.success) {
        swal('Hooray!!!', 'Scrumble was successfully deleted', 'success');
        tempRows.splice(index, 1);
        setRows(tempRows);
      } else {
        swal('Oops!!!', res.message, 'error');
      }

      setDeleteScrumble(false);
      setRows(tempRows);
    } catch (err) {
      setDeleteScrumble(false);
      swal('Oops!!!', 'Something went wrong please try again', 'error');
    }
  }

  function createData(data: ITableData) {
    const actions = (
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton
          classes={{
            root: classes.iconButton,
          }}
          className={classes.iconButton}
          onClick={() => {
            setDeleteScrumble(true);
            setScrumbleId(data.scrumbleID);
          }}
        >
          <DeleteIcon className={classes.icon} />
        </IconButton>
      </Box>
    );

    data.createdAt = dayjs(data.createdAt).format('YYYY/MM/DD mm:ss');
    return { ...data, actions };
  }

  return (
    <Box>
      <Typography variant="h4" style={{ marginBottom: 14 }}>
        Game Setting
      </Typography>
      <Box style={{ width: 180, marginBottom: 20 }}>
        <Button
          onClick={() => {
            setShowModal(true);
          }}
        >
          <AddCircleOutlineIcon style={{ marginRight: 10 }} />
          New Scrumble
        </Button>
      </Box>
      <MuiTable rows={rows} columns={columns} />

      <MuiModal open={showModal} setOnClose={setShowModal}>
        <Typography style={{ marginTop: 10, marginBottom: 15 }} component="div">
          Fill in the field and click save to add a new scrumble
        </Typography>
        <Formik
          initialValues={{
            scrumble: '',
          }}
          enableReinitialize={true}
          validationSchema={ValidationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const tempRows = [...rows];
              const user = new UserService();
              const res: any = await user.createScrumble(values.scrumble);

              if (res.success) {
                swal('Hooray!!!', 'Scrumble was successfully added', 'success');
                tempRows.push(createData({ ...res.data }));
                setRows(tempRows);
                resetForm();
                setShowModal(false);
              } else {
                swal('Oops!!!', res.message, 'error');
              }

              setSubmitting(false);
            } catch (err) {
              swal('Oops!!!', 'Something went wrong please try again', 'error');
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FTextField
                    type="text"
                    name="scrumble"
                    label="Scrumble Name"
                    placeholder="Scrumble Name"
                  />
                </Grid>
                <Box
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                    marginTop: 30,
                  }}
                >
                  <Grid item xs={2} marginRight={2}>
                    <Button
                      onClick={() => {
                        setShowModal(false);
                      }}
                      style={{
                        background: 'rgb(238, 239, 240)',
                        color: '#000',
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button type="submit">Save</Button>
                  </Grid>
                </Box>
              </Grid>
            </form>
          )}
        </Formik>
      </MuiModal>

      <ConfirmiationModal
        handleConfirmation={() => handleAction()}
        showModal={scrumbleName}
        closeModal={() => setDeleteScrumble(false)}
        title="Are you sure you want to delete this scrumble?"
      />
    </Box>
  );
};
