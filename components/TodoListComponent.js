import React, {Component} from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {updateTodoList, deleteTodoList, queryAllTodoList } from '../databases/allSchemas';
import realm from '../databases/allSchemas';
import Swipeout from 'react-native-swipeout';

import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponent';
import DialogTester from './DialogTester';


let FlatListItem = props => {
    const { itemIndex, id, name, creationDate, popupDialogComponent, onPressItem } = props;
    showEditModel = () => {

    }
    showDeleteConfirmation = () => {
        Alert.alert(
            'Delete',
            'Delete a todoList',
            [
                {
                    text: 'No', onPress: () => { 
                        console.log('reloading data');
                    },
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => { 
                        console.log('reloading data');
                    }
                },
            ],
            {cancelable: true}
        );
    };

    return (
        <Swipeout right={[
            {
                text: 'Edit',
                backgroundColor: 'rgb(81,143,237)',
                onPress: showEditModel
            },
            {
                text: 'Delete',
                backgroundColor: 'rgb(217,80,64)',
                onPress: showDeleteConfirmation
            }
        ]} autoClose={true}>

            <TouchableOpacity onPress={onPressItem}>
             <View style = {{ backgroundColor: itemIndex % 2 == 0 ? 'powderblue' : 'skyblue' }}>
                <Text style = {{ fontWeight: 'bold', fontSize: 18, margin: 10}}>{name}</Text>
                <Text style = {{ fontSize: 18, margin: 10}} numberOfLines= {2}>{creationDate.toLocaleString()}</Text>
             </View>
            </TouchableOpacity>
        </Swipeout>
    );
}

export default class TodoListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todoLists: [],
            dialogVisible: false
        };
        this.reloadData();
        realm.addListener('change', () => {
            this.reloadData();
        });
    }

    reloadData = () => {
        queryAllTodoList().then((todoLists) => {
            this.setState({todoLists});
        }).catch((error) => {
            this.setState({todoLists:[] });

        });
    }
        render(){
        return (
            <View style = {styles.container}> 
                <HeaderComponent
                    title = {"Todo List"}
                    hasAddButton = {true}
                    showAddTodoList = {
                        () => {
                            // this.refs.popupDialogComponent.showDialogComponentForAdd();
                            const visible = this.state.dialogVisible;
                            this.state.dialogVisible = !visible;
                        }
                    }
                />
                <FlatList
                 style = {styles.flatList}
                 data = {this.state.todoLists}
                 renderItem = {({ item, index }) => 
                 <FlatListItem {...item} itemIndex={index}
                 popupDialogComponent = {this.refs.popupDialogComponent}
                 onPressItem={ () => {
                    alert('You pressed item');
                 }
                 }/>}
                 keyExtractor={item => item.id}
                 />
                 <DialogTester dialogVisible={this.state.dialogVisible}/>
                 {/* <PopupDialogComponent ref = {"popupDialogComponent"} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    flatList: {
        flex: 1,
        flexDirection: 'column',
    }

});