import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import quizService from '../services/quizService';
import Papa from 'papaparse';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { EditorState, convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { CloudUpload, Cancel } from '@mui/icons-material';
import Dropzone from 'react-dropzone';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
});

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '800px',
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

const OptionContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
});

const StyledButton = styled(Button)({
  marginTop: '10px',
  marginBottom: '20px',
  fontWeight: 'bold',
});

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [questionType, setQuestionType] = useState('4-options');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [multipleCorrect, setMultipleCorrect] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const [bulkQuestions, setBulkQuestions] = useState('');
  const [format, setFormat] = useState('semiColon');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const addQuestion = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    if (!rawContentState.blocks[0].text || (questionType !== 'numerical' && options.some(opt => !opt)) || (!correctAnswers.length && questionType !== 'numerical')) {
      setSnackbarMessage('Please fill all fields.');
      setSnackbarOpen(true);
      return;
    }
    const questionHTML = stateToHTML(editorState.getCurrentContent());
    setQuestions([...questions, { question: questionHTML, options, correctAnswers, questionType, multipleCorrect }]);
    setEditorState(EditorState.createEmpty());
    setOptions(Array(questionType.split('-')[0] === 'numerical' ? 0 : parseInt(questionType.split('-')[0])).fill(''));
    setCorrectAnswers([]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setSnackbarMessage('Please enter a quiz title.');
      setSnackbarOpen(true);
      return;
    }
    if (!questions.length) {
      setSnackbarMessage('Please add at least one question.');
      setSnackbarOpen(true);
      return;
    }
    try {
      await quizService.createQuiz(title, questions);
      setSnackbarMessage('Quiz created successfully!');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setSnackbarMessage('Failed to create quiz.');
      setSnackbarOpen(true);
      console.error(err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const downloadTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Question,Option1,Option2,Option3,Option4,CorrectAnswer\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'quiz_template.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log(results.data[0]);
          const parsedQuestions = results.data.map(row => ({
            question: row.Question,
            options: [row.Option1, row.Option2, row.Option3, row.Option4],
            correctAnswers: row.CorrectAnswer,
          }));
          setQuestions([...questions, ...parsedQuestions]);
        },
      });
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);
    setQuestions(reorderedQuestions);
  };

  const handleQuestionTypeChange = (event) => {
    const newType = event.target.value;
    setQuestionType(newType);
    setOptions(Array(newType.split('-')[0] === 'numerical' ? 0 : parseInt(newType.split('-')[0])).fill(''));
    setCorrectAnswers([]);
  };

  const handleCorrectAnswerChange = (option) => {
    if (multipleCorrect) {
      setCorrectAnswers((prev) => prev.includes(option) ? prev.filter((answer) => answer !== option) : [...prev, option]);
    } else {
      setCorrectAnswers([option]);
    }
  };

  const handleMultipleCorrectChange = (event) => {
    setMultipleCorrect(event.target.checked);
    setCorrectAnswers([]);
  };

  const openBulkAddDialog = () => {
    setBulkAddOpen(true);
  };

  const closeBulkAddDialog = () => {
    setBulkAddOpen(false);
    setBulkQuestions('');
  };
  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };
  const handleBulkAdd = () => {
    try {
      const delimiter = format === 'semiColon' ? ';' : format === 'comma' ? ',' : '\t';
      const newQuestions = bulkQuestions.split('\n').map((q) => {
        console.log(q);
        console.log(delimiter);
        const parts = q.split(delimiter);
        if (parts.length < 6) throw new Error('Invalid question format');

        const question = parts[0];
        const options = parts.slice(1, -1);
        const correctAnswers = parts[parts.length - 1].replace('\\n', '').split(',');
        console.log(correctAnswers);
        return {
          question,
          options,
          correctAnswers,
          questionType: `${options.length}-options`,
          multipleCorrect: correctAnswers.length > 1,
        };
      });

      setQuestions([...questions, ...newQuestions]);
      closeBulkAddDialog();
    } catch (error) {
      setError('Error parsing questions. Please check the format and try again.');
    }
  };

  const handleDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setBulkQuestions(event.target.result);
    };
    reader.readAsText(acceptedFiles[0]);
  };

  return (
    <StyledContainer>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>
        Create Quiz
      </Typography>
      <FormContainer>
        <TextField
          label="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Add Question
        </Typography>
        <TextField
          select
          label="Question Type"
          value={questionType}
          onChange={handleQuestionTypeChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="2-options">2 Options</MenuItem>
          <MenuItem value="3-options">3 Options</MenuItem>
          <MenuItem value="4-options">4 Options</MenuItem>
          <MenuItem value="5-options">5 Options</MenuItem>
          <MenuItem value="6-options">6 Options</MenuItem>
          <MenuItem value="numerical">Numerical Value</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Switch
              checked={multipleCorrect}
              onChange={handleMultipleCorrectChange}
            />
          }
          label="Multiple Correct Answers"
        />
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
        />
        {questionType !== 'numerical' &&
          options.map((option, index) => (
            <OptionContainer key={index}>
              <TextField
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                fullWidth
                margin="normal"
                required
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={correctAnswers.includes(option)}
                    onChange={() => handleCorrectAnswerChange(option)}
                  />
                }
                label="Correct Answer"
              />
            </OptionContainer>
          ))}
        <StyledButton
          variant="contained"
          color="primary"
          onClick={addQuestion}
        >
          Add Question
        </StyledButton>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {questions.map((question, index) => (
                  <Draggable
                    key={index}
                    draggableId={String(index)}
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {question.correctAnswers && (
                          <ListItemText
                            primary={<div dangerouslySetInnerHTML={{ __html: question.question }} />}
                            secondary={`Options: ${question.options.join(', ')} - Correct Answers: ${question.correctAnswers}`}
                          />
                        )}
                        {question.correctAnswers&&(
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeQuestion(index)}
                          >
                          <DeleteIcon />
                        </IconButton>
                        )}
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
        <StyledButton
          variant="contained"
          color="secondary"
          onClick={downloadTemplate}
        >
          <DownloadIcon />
          Download CSV Template
        </StyledButton>
        <StyledButton
          variant="contained"
          component="label"
        >
          <UploadFileIcon />
          Upload CSV File
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
          />
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={openBulkAddDialog}
        >
          Bulk Add Questions
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleQuizSubmit}
        >
          Submit Quiz
        </StyledButton>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="info">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </FormContainer>

      <Dialog open={bulkAddOpen} onClose={closeBulkAddDialog} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#1976d2', color: 'white' }}>Bulk Add Questions</DialogTitle>
        <DialogContent style={{ padding: '24px' }}>
          <DialogContentText>
            Enter multiple questions in one of the following formats:
            <List>
            <ListItem>
              <ListItemText>Semi-colon separated: <code>Question;Option1;Option2;Option3;Option4;CorrectAnswer1,CorrectAnswer2</code></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Comma separated: <code>Question,Option1,Option2,Option3,Option4,CorrectAnswer1,CorrectAnswer2</code></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Tab separated: <code>Question\tOption1\tOption2\tOption3\tOption4\tCorrectAnswer1,CorrectAnswer2</code></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Sentence format: <code>Rows of a relation are known as the _______. Degree Tuples Entity All of the above Degree</code></ListItemText>
            </ListItem>
            </List>
            <Alert>Each Question should be separated by \n</Alert>
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel id="format-select-label">Format</InputLabel>
            <Select
              labelId="format-select-label"
              value={format}
              onChange={handleFormatChange}
            >
              <MenuItem value="semiColon">Semi-colon separated</MenuItem>
              <MenuItem value="comma">Comma separated</MenuItem>
              <MenuItem value="tab">Tab separated</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Bulk Questions"
            type="text"
            fullWidth
            multiline
            rows={10}
            value={bulkQuestions}
            onChange={(e) => setBulkQuestions(e.target.value)}
            variant="outlined"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Divider style={{ margin: '20px 0' }} />
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: 8,
                  padding: 20,
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: '#666',
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload style={{ fontSize: 48, color: '#666' }} />
                <Typography variant="h6">Drag & drop a file here, or click to select a file</Typography>
              </Box>
            )}
          </Dropzone>
          <Box marginTop={2} padding={2} border="1px solid #ccc" borderRadius={8} bgcolor="#f9f9f9">
            <Typography variant="h6">Preview</Typography>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              {bulkQuestions}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button onClick={closeBulkAddDialog} color="primary" variant="outlined" startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleBulkAdd} color="primary" variant="contained">
            Add Questions
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AdminPage;







