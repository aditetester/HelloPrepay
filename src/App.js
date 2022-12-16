import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import { StartupContainer } from './Containers'
import PersistLoading from './Containers/PersistLoading'
import './Translations'

//Sentry.io error tracking
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: 'https://cb1ad5a648a741cea95ac2320a3c8cd4@o4504326226444288.ingest.sentry.io/4504326246825984',
})

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

export default Sentry.wrap(App)
