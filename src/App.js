import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import { StartupContainer } from './Containers'
import PersistLoading from './Containers/PersistLoading'
import './Translations'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<PersistLoading />}
        persistor={persistor}
        onBeforeLift={() => new Promise(resolve => setTimeout(resolve, 2000))}
      >
        <StartupContainer />
      </PersistGate>
    </Provider>
  )
}

export default App
