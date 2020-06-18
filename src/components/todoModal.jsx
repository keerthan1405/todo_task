import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import validate from './formValidations';
import './style.css';

Modal.setAppElement('#root');
const TodoModal = (props) => {
    const [values, setValues] = useState({ summary: '', description: '', dueDate: '', priority: 0 });
    const [errors, setErrors] = useState({});
    const [disableSaveButton, setDisableSaveButton] = useState(true)
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validate(values));
    };

    const handleChange = (event) => {
        event.persist();
        setValues(values => ({ ...values, [event.target.name]: event.target.value }));
        setErrors(validate(values));
        if (errors.summary || errors.description || values.summary === '') {
            setDisableSaveButton(true);
        } else {
            setDisableSaveButton(false);
        }
    };

    function saveTask() {
        if (values.summary && values.description && !props.viewMode) {
            setDisableSaveButton(true);
            props.addTask(values);
            setValues({ summary: '', description: '', dueDate: '', priority: 0 })
        }
    }

    function editTask() {
        if (values.summary && values.description && !props.viewMode) {
            setDisableSaveButton(true);
            props.editTask(values, props.currentTask.id);
            setValues({ summary: '', description: '', dueDate: '', priority: 0 })
        }
    }

    function closeModal() {
        setDisableSaveButton(true);
        setModalIsOpen(false);
        setValues({ summary: '', description: '', dueDate: '', priority: 0 });
        props.closingModal();
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        setModalIsOpen(props.showModal);
        if (props.viewMode || props.editMode) {
            setValues({
                summary: props.currentTask.summary,
                description: props.currentTask.description,
                dueDate: props.currentTask.dueDate,
                priority: props.currentTask.priority
            });
        }
        console.log(values, 'values1234')
    }, [props])

    const customStyles = {
        content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' }
    };
    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className="close--icon">
                    <button type="button" onClick={closeModal}><i className="fas fa-times"></i></button>
                </div>
                {!props.viewMode && !props.editMode && <h2>Add Task</h2>}
                {props.viewMode && <h2>View Task</h2>}
                {props.editMode && <h2>Edit Task</h2>}
                <form onSubmit={handleSubmit} noValidate>
                    <label>Summary:</label>
                    <input
                        type="text"
                        name="summary"
                        autoComplete="off"
                        // defaultValue={''}
                        value={values.summary}
                        required
                        onChange={handleChange}
                        placeholder={'Enter Summary'}
                        readOnly={props.viewMode}
                        autoFocus
                    />
                    <br />
                    {errors.summary && (
                        <p class="err">{errors.summary}</p>
                    )}
                    <label>Description:</label>
                    <textarea
                        name="description"
                        autoComplete="off"
                        value={values.description}
                        required
                        onChange={handleChange}
                        readOnly={props.viewMode}
                        placeholder={'Enter Here'} />
                    <br />
                    {values.description && errors.description && (
                        <p class="err">{errors.description}</p>
                    )}
                    <label>Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        autoComplete="off"
                        value={new Date(values.dueDate).toLocaleDateString('fr-CA')}
                        required
                        readOnly={props.viewMode}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Priority:</label>
                    <select value={values.priority} name="priority" onChange={handleChange} disabled={props.viewMode}>
                        <option value={0}>None</option>
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                    </select>
                    <br />
                    <div align="right" >  {props.editMode ?
                        <button  type="submit" disabled={props.viewMode || disableSaveButton} onClick={editTask} className="modal--submit">Edit</button> :
                        <button type="submit" disabled={props.viewMode || disableSaveButton} onClick={saveTask} className="modal--submit">Save</button>
                    }

                        <a align="left" onClick={closeModal} className="button btn">Cancel</a> </div>
                </form>

            </Modal>
        </div>
    )
}

export default TodoModal