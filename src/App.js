import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import { StartupContainer } from './Containers'
import './Translations'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StartupContainer />
    </PersistGate>
  </Provider>
)

export default App
