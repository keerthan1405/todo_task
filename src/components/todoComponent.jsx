import React, { Fragment } from 'react';
import TodoModal from './todoModal';
import { connect } from 'react-redux';
import * as actions from '../store/actions/index';
import './style.css';
import Hotkeys from "react-hot-keys";

class TodoComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			viewMode: false,
			editMode: false,
			taskList: [],
			currentTask: '',
			filterData: [],
			sort: 'ascending',
			displayTab: 'allTasks'
		}
    }
    
    componentDidMount = () => {
        window.addEventListener('keypress', this.keyPress);
    }

	showModal = () => {
		this.setState({ showModal: true });
	};

	addTask = async (task) => {
		var createdOn = new Date().toLocaleString().split(",")[0];
		var dueDate = this.formatDate(task.dueDate)
		if (task.dueDate.length === 0)
			task.dueDate = createdOn;
		else
			task.dueDate = dueDate;
		task.id = Math.floor(100000 + Math.random() * 900000);
		task.createdOn = createdOn;
		task.currentState = 'open';
		task.marked = false;
		await this.setState((prevState => ({
			taskList: [task, ...prevState.taskList]
		})), () => {
			this.props.taskListArray(this.state.taskList)
		});
		await this.setState((prevState => ({
			filterData: [task, ...prevState.filterData]
		})), () => {
			this.props.taskListArray(this.state.taskList)
		});
		this.setState({ showModal: false, editMode: false, viewMode: false });
	}

	formatDate = (inputDate) => {
		var date = new Date(inputDate);
		if (!isNaN(date.getTime())) {
			return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
		}
	}

	editTask = (task, id) => {
		var editTaskData = this.state.taskList;
		var dueDate = this.formatDate(task.dueDate)
		editTaskData.map(taskData => {
			if (taskData.id === id) {
				taskData.summary = task.summary;
				taskData.description = task.description;
				taskData.dueDate = dueDate;
				taskData.priority = task.priority;
			}
		});
		this.setState({ taskList: editTaskData, filterData: editTaskData, showModal: false, editMode: false, viewMode: false }, () => this.filterTasks(this.state.displayTab));
	}

	groupBy = (e) => {
		if (e && e.target.value == 2) {
			var groupByPriority = this.state.filterData.sort((a, b) => {
				return b.priority - a.priority;
			})
			this.setState({ filterData: groupByPriority })

		}
		if (e && e.target.value == 1) {
			var groupByDueDate = this.state.filterData.sort((a, b) => {
				return +new Date(a.dueDate) - +new Date(b.dueDate);
			})
			this.setState({ filterData: groupByDueDate })

		}
		if (e && e.target.value == 0) {
			var groupByDate = this.state.filterData.sort((a, b) => {
				return +new Date(a.createdOn) - +new Date(b.createdOn);
			})
			this.setState({ filterData: groupByDate })
		}
	}

	sort = (sortColumn) => {
		switch (sortColumn) {
			case 'priority':
				if (this.state.sort === 'ascending') {
					var groupByAscPriority = this.state.filterData.sort((a, b) => {
						return a.priority - b.priority;
					});
					this.setState({ sort: 'descending' })
					this.setState({ filterData: groupByAscPriority });
				} else {
					var groupByDescPriority = this.state.filterData.sort((a, b) => {
						return b.priority - a.priority;
					});
					this.setState({ sort: 'ascending' })
					this.setState({ filterData: groupByDescPriority });
				}
				break;
			case 'summary':
				if (this.state.sort === 'ascending') {
					var groupByAscSummary = this.state.filterData.sort((a, b) => {
						if (a.summary < b.summary)
							return -1;
					});
					this.setState({ sort: 'descending' })
					this.setState({ filterData: groupByAscSummary });
				} else {
					var groupByDescSummary = this.state.filterData.sort((a, b) => {
						if (a.summary > b.summary)
							return -1;
					});
					this.setState({ sort: 'ascending' })
					this.setState({ filterData: groupByDescSummary });
				}
				break;
			case 'dueDate':
				if (this.state.sort === 'ascending') {
					var groupByAscDueDate = this.state.filterData.sort((a, b) => {
						return +new Date(a.dueDate) - +new Date(b.dueDate);
					});
					this.setState({ sort: 'descending' })
					this.setState({ filterData: groupByAscDueDate });
				} else {
					var groupByDescDueDate = this.state.filterData.sort((a, b) => {
						return +new Date(b.dueDate) - +new Date(a.dueDate);
					});
					this.setState({ sort: 'ascending' })
					this.setState({ filterData: groupByDescDueDate });
				}
				break;
			case 'createdOn':
				if (this.state.sort === 'ascending') {
					var groupByAscCreatedOn = this.state.filterData.sort((a, b) => {
						return +new Date(a.createdOn) - +new Date(b.createdOn);
					});
					this.setState({ sort: 'descending' })
					this.setState({ filterData: groupByAscCreatedOn });
				} else {
					var groupByDescCreatedOn = this.state.filterData.sort((a, b) => {
						return +new Date(b.createdOn) - +new Date(a.createdOn);
					});
					this.setState({ sort: 'ascending' })
					this.setState({ filterData: groupByDescCreatedOn });
				}
				break;
			case 'currentState':
				if (this.state.sort === 'ascending') {
					var groupByAscCurrentState = this.state.filterData.sort((a, b) => {
						if (a.currentState < b.currentState)
							return -1;
					});
					this.setState({ sort: 'descending' })
					this.setState({ filterData: groupByAscCurrentState });
				} else {
					var groupByDescCurrentState = this.state.filterData.sort((a, b) => {
						if (a.currentState > b.currentState)
							return -1;
					});
					this.setState({ sort: 'ascending' })
					this.setState({ filterData: groupByDescCurrentState });
				}
				break;

			default:
				break;
		}
	}

	viewTaskdata = (task) => {
		this.setState({ currentTask: task, viewMode: true, showModal: true });
	}

	editTaskdata = (task) => {
		this.setState({ currentTask: task, editMode: true, showModal: true });
	}

	deleteTaskdata = (task) => {
		var arr = this.state.taskList;
		arr = arr.filter(item => {
			return item.id !== task.id;
		});
		this.setState({ filterData: arr, taskList: arr }, () => this.filterTasks(this.state.displayTab));
	}

	markTask = (task, e) => {
		var markTaskData = this.state.taskList;
		markTaskData.map(taskData => {
			if (taskData.id === task.id) {
				taskData.marked = e.target.checked;
			}
		});
		this.setState({ taskList: markTaskData, filterData: markTaskData }, () => this.filterTasks(this.state.displayTab));
	}

	deleteBulkTasks = () => {
		var deleteBulkData = this.state.taskList.filter(taskData => taskData.marked !== true);
		this.setState({ filterData: deleteBulkData, taskList: deleteBulkData }, () => this.filterTasks(this.state.displayTab));
	}

	reopenTasks = () => {
		var reOpenTasks = this.state.taskList;
		reOpenTasks.map(taskData => {
			if (taskData.marked === true) {
				taskData.currentState = 'open';
				taskData.marked = false;
			}
		});
		this.setState({ filterData: reOpenTasks, taskList: reOpenTasks }, () => this.filterTasks(this.state.displayTab));
	}

	closeTasks = () => {
		var closeTasks = this.state.taskList;
		closeTasks.map(taskData => {
			if (taskData.marked === true) {
				taskData.currentState = 'close';
				taskData.marked = false;
			}
		});
		this.setState({ filterData: closeTasks, taskList: closeTasks }, () => this.filterTasks(this.state.displayTab));
	}

	completeTask = (task) => {
		var arr = this.state.filterData;
		var taskIndex = arr.findIndex((item => item.id === task.id));
		if (arr[taskIndex].currentState === 'open') {
			arr[taskIndex].currentState = "close"
		} else {
			arr[taskIndex].currentState = "open"
		}
		this.setState({ filterData: arr, taskList: arr });
		this.filterTasks(this.state.displayTab);
	}

	closingModal = () => {
		this.setState({ editMode: false, viewMode: false, showModal: false });
	}

	handleSearch(event) {
		const filterValue = event.target.value.toLowerCase();
		if (this.state.displayTab === 'allTasks') {
			this.searchObjects(this.state.taskList, filterValue, 'all');
		}
		if (this.state.displayTab === 'pending') {
			this.searchObjects(this.state.filterPending, filterValue, 'open');
		}
		if (this.state.displayTab === 'completed') {
			this.searchObjects(this.state.filterCompleted, filterValue, 'close');

		}
	}

	searchObjects = (array, filterValue, type) => {
		let filteredList = array.filter((item) => {
			if (type === 'all') {
				return (item.summary.toLowerCase().match(filterValue))
					|| (item.description.toLowerCase().match(filterValue))
			} else {
				return ((item.summary.toLowerCase().match(filterValue))
					|| (item.description.toLowerCase().match(filterValue)) && (item.currentState === type))
			}
		});
		this.setState({
			filterData: filteredList
		});
	}

	filterTasks = (filterType) => {
		this.setState({ displayTab: filterType });
		if (filterType === 'pending') {
			var filterPending = this.state.taskList.filter(taskData => taskData.currentState == 'open');
			this.setState({ filterData: filterPending, filterPending: filterPending });
		}
		if (filterType === 'completed') {
			var filterCompleted = this.state.taskList.filter(taskData => taskData.currentState == 'close');
			this.setState({ filterData: filterCompleted, filterCompleted: filterCompleted });
		}
		if (filterType === 'allTasks') {
			this.setState({ filterData: this.state.taskList });
		}
	}

	keyPress = (e) => {
		if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
			this.searchRef.focus();
		}
	}

	render() {
		return (
			<div className="main--block">
				<Hotkeys
					keyName="ctrl+shift+f"
					onKeyDown={this.keyPress.bind(this)}
				></Hotkeys>
				<div className="add--btn" title="Add Task" onClick={this.showModal}>
					<i className="fa fa-plus"></i>
				</div>
				<div className="container">
					<div className="card--block">
						<div className="card--header">
							<h2>ToDo List</h2>
						</div>
						<div className="select--block">
						</div>
						<div className="search--block">
							<select onChange={this.groupBy}>
								<option selected disabled>Group By</option>
								<option value={0}>Created On</option>
								<option value={1}>Due Date</option>
								<option value={2}>Priority</option>
							</select>
							<input ref={(searchRef) => { this.searchRef = searchRef }} placeholder="Search..." onKeyUp={(e) => this.handleSearch(e)}></input>
						</div>
						<div className="tabs-block">
							<nav>
								<div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
									<a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" role="tab" aria-controls="nav-home" aria-selected="true" onClick={() => this.filterTasks('allTasks')}>All tasks</a>

									<a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" role="tab" aria-controls="nav-contact" aria-selected="false" onClick={() => this.filterTasks('pending')}>Pending</a>

									<a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" role="tab" aria-controls="nav-profile" aria-selected="false" onClick={() => this.filterTasks('completed')}>Completed</a>
								</div>
							</nav>
							<div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
								<div className="tab-pane fade show active" role="tabpanel" aria-labelledby="nav-home-tab">
									<table className="table table--block">
										<thead>
											<tr>
												<th></th>
												<th>Summary
                                                <i className="fa fa-sort" onClick={() => this.sort('summary')} title="Sort"></i>
												</th>
												<th>Priority
                                                <i className="fa fa-sort" onClick={() => this.sort('priority')} title="Sort"></i>
												</th>
												<th>Created On
                                                <i className="fa fa-sort" onClick={() => this.sort('createdOn')} title="Sort"></i>
												</th>
												<th>Due Date
                                                <i className="fa fa-sort" onClick={() => this.sort('dueDate')} title="Sort"></i>
												</th>
												<th>Current State
                                                <i className="fa fa-sort" onClick={() => this.sort('currentState')} title="Sort"></i>
												</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{this.state.filterData.map(task =>
												<Fragment key={task.id}>
													<tr className={task.currentState === 'close' ? 'strike' : ''}>
														<td><input className="td--check" checked={task.marked} onChange={(e) => this.markTask(task, e)} type="checkbox"></input></td>
														<td onClick={() => this.viewTaskdata(task)}>{task.summary}</td>
														<td onClick={() => this.viewTaskdata(task)}>
															{task.priority == 0 && <span>None</span>}
															{task.priority == 1 && <span>Low</span>}
															{task.priority == 2 && <span>Medium</span>}
															{task.priority == 3 && <span>High</span>}
														</td>
														<td onClick={() => this.viewTaskdata(task)}>{task.createdOn}</td>
														<td onClick={() => this.viewTaskdata(task)}>{task.dueDate}</td>
														<td onClick={() => this.viewTaskdata(task)}>{task.currentState}</td>
														<td>
															<div className="actions--block">
																<i className={"edit fas fa-edit"} onClick={() => this.editTaskdata(task)} title="Edit" ></i>
																<i className="fas fa-trash delete" onClick={() => this.deleteTaskdata(task)} title="Delete"></i>
																{task.currentState === 'close' ? <i className=" check fas fa-redo-alt" onClick={() => this.completeTask(task)} title="Reopen the task"></i> :
																	<i className=" check fas fa-check" onClick={() => this.completeTask(task)} title="Click to Complete"></i>}
															</div>
														</td>
													</tr>
												</Fragment>
											)
											}
										</tbody>
									</table>
									{this.state.filterData.length == 0 && <h5 className="no-tasks">No Tasks to display</h5>}
									<div className="bottom--btn">
										<button onClick={this.deleteBulkTasks} className="delete">Delete Selected</button>
										<button onClick={this.reopenTasks} className="orange">Re-open Selected</button>
										<button onClick={this.closeTasks} className="green">Close Selected</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<TodoModal {...this.state} addTask={this.addTask} editTask={this.editTask} closingModal={this.closingModal} />
			</div>
		)
	}
}

const mapStateToProps = state => ({
	taskList: state.userAccountReducer.taskList,

})

const mapDispatchToProps = dispatch => ({
	taskListArray: (task) => dispatch(actions.taskListArray(task))
})

export default connect(mapStateToProps, mapDispatchToProps)(TodoComponent)
