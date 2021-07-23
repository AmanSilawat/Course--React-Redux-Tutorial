import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, data) => {
        console.log('_', _)
        console.log('data', data)
        const allNotifications = selectAllNotifications(data.getState())
        const [latestNotification] = allNotifications
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.notifications
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state, action) {
            Object.values(state.entities).forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled]: (state, action) => {
            // state.forEach(notification => {
            //     // Any notifications we've read are no longer new
            //     notification.isNew = !notification.read
            // })
            // state.push(...action.payload)
            // // Sort with newest first
            // state.sort((a, b) => b.date.localeCompare(a.date))

            // ! Managing Normalized State with createEntityAdapter
            Object.values(state.entities).forEach(notification => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read
            })
            notificationsAdapter.upsertMany(state, action.payload)
        }
    }
})

console.log('notificationsSlice', notificationsSlice)
console.log('notificationsSlice.actions.allNotificationsRead', notificationsSlice.actions.allNotificationsRead)

export const { allNotificationsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;

// export const selectAllNotifications = state => state.notifications;


// ! Managing Normalized State with createEntityAdapter
export const { selectAll: selectAllNotifications } = notificationsAdapter.getSelectors(state => state.notifications)