/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TodoListComponent from './components/TodoListComponent';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TodoListComponent);
