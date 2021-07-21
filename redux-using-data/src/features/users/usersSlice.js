import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { id: '0', name: 'Saleh Majeet' },
    { id: '1', name: 'Sahil Khan' },
    { id: '2', name: 'Aman Silawat' }
]

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})

export default usersSlice.reducer
