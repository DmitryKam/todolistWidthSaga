import {addTaskWorkerSaga, fetchTasks, fetchTasksWorkerSaga} from "./tasks-sagas";
import {call, put} from "redux-saga/effects";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {GetTasksResponse, TaskPriorities, TaskStatuses, todolistsAPI} from "../../api/todolists-api";
import {addTaskAC, setTasksAC} from "./tasks-reducer";


beforeEach(() => {

})


test('fetchTasksWorkerSaga success flow', () => {
    const todolistId = "todolistid";
    const gen = fetchTasksWorkerSaga({type: "TASKS/FETCH-TASKS", todolistId: todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, todolistId))
    const fakeApiResponse: GetTasksResponse = {
        error: "",
        totalCount: 1,
        items: [
            {
                id: todolistId, title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
        ]
    }
    expect(gen.next(fakeApiResponse).value).toEqual(put(setTasksAC(fakeApiResponse.items, todolistId)))
    const next = gen.next();
    expect(next.value).toEqual(put(setAppStatusAC('succeeded')))
    expect(next.done).toBeTruthy()
})


test('addTaskWorkerSaga error flow', () => {
    const todolistId = "todolistid"
    const title = "task title"

    const gen = addTaskWorkerSaga({type: "TASKS/ADD-TASK", title:title,todolistId: todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.createTask, todolistId, title))
    expect(gen.throw({message:"some error"}).value).toEqual(put(setAppErrorAC("some error")))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))


})