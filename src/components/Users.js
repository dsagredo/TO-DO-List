import React, { useState, useEffect } from 'react';
import db from '../FirestoreConfig';
import { Container, Table, Button, Row, Col, InputGroup, Input, Spinner, Modal, ModalBody, ModalFooter, Alert, Fade } from 'reactstrap';
import { IconContext } from "react-icons";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const ModalDelete = (props) => {
    const {
        userId,
        deleteId,
        className
    } = props;
    const [isModal, setModal] = useState(false);
    const toggleModal = () => setModal(!isModal);
    return (
        <Container>
            <Button color="danger" onClick={toggleModal}>
                <IconContext.Provider value={{ size: '1.0em', style: { verticalAlign: 'text-top' } }}>
                    <FaTrashAlt />
                </IconContext.Provider>
            </Button>
            <Modal isOpen={isModal} className={className} data-backdrop="static" data-keyboard="false">
                <ModalBody>
                    ¿Seguro que quieres eliminar este registro?
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => { deleteId(userId); toggleModal(false); }}>Si</Button>
                    <Button color="secondary" onClick={toggleModal}>No</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

const Users = props => {
    const { setEditing, setIsLoading, messageUser, setFadeIn } = props;
    const modalData = {
        isOpen: false,
        className: 'modal-dialog-centered'
    }
    const [isModalData] = useState(modalData);
    const deleteId = id => {
        setEditing(false);
        setIsLoading(true);
        setFadeIn(true);
        messageUser("Eliminado");
        db.collection('users').doc(id).delete().then(function () {
        }).catch(function (error) {
            messageUser("Error ", error);
        });
    }
    return (
        <>
            <Table hover className="text-center">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.data.length > 0 ? (
                            props.data.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>
                                        <Button color="warning" onClick={() => { props.editId(user) }}>
                                            <IconContext.Provider value={{ color: "#ffffff", size: '1.1em', style: { verticalAlign: 'text-top' } }}>
                                                <FaEdit />
                                            </IconContext.Provider>
                                        </Button>
                                    </td>
                                    <td><ModalDelete isOpen={isModalData.isOpen} deleteId={deleteId} userId={user.id} className={isModalData.className} /></td>
                                </tr>
                            ))
                        ) : (
                                <tr>
                                    <td colSpan={3}>No hay registro</td>
                                </tr>
                            )
                    }
                </tbody>
            </Table>
        </>
    )
}

const AddUser = (props) => {
    const { isError } = props;
    const [isUser, setUser] = useState({ name: '' });
    const changeValue = e => {
        const { value } = e.target;
        setUser({ name: value })
    }
    return (
        <>
            <Row>
                <Col xs="10">
                    <InputGroup>
                        <Input placeholder="Agregar un nuevo Item" onChange={changeValue} value={isUser.name || ''} required />
                    </InputGroup>
                    {isError.name && (
                        <h4 className="is-danger">{isError.name}</h4>
                    )}
                </Col>
                <Col xs="2">
                    <Button block color="success" onClick={() => { props.addUser(isUser); setUser('') }}>Agregar</Button>
                </Col>
            </Row>
        </>
    )
};

const EditUser = props => {
    const [isUser, setUser] = useState(props.isCurrentUser);
    useEffect(() => {
        setUser(props.isCurrentUser)
    }, [props]);
    const editChange = e => {
        const { value } = e.target;
        setUser({ id: isUser.id, name: value })
    }
    return (
        <>
            <Row>
                <Col xs="8">
                    <InputGroup>
                        <Input name="name" value={isUser.name} onChange={editChange} />
                    </InputGroup>
                </Col>
                <Col xs="2">
                    <Button block color="success" onClick={() => { props.updateUser(isUser) }}>Actualizar</Button>
                </Col>
                <Col xs="2">
                    <Button block color="secondary" onClick={() => props.setEditing(false)}>Cancel</Button>
                </Col>
            </Row>
        </>
    )
}

const App = () => {
    const [isUsers, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentUser, setCurrentUser] = useState([]);
    const [isEditing, setEditing] = useState(false);
    const [isMessage, setMessage] = useState('');
    const [isFadeIn, setFadeIn] = useState(false);
    const [isError, setError] = useState({});
    useEffect(() => {
        if (isLoading) {
            db.collection('users').orderBy("name", "asc").onSnapshot((querySnapshot) => {
                setUsers(querySnapshot.docs.map((doc) => ({
                    id: doc.id, ...doc.data()
                })));
                setTimeout(() => {
                    setIsLoading(false)
                }, 3000)
            });
        }
    });

    const validateForm = (value) => {
        let isError = {};
        if (!value.name) {
            isError.name = 'Ingrese su nombre';
        }
        return isError;
    }
    const editId = user => {
        setEditing(true)
        setCurrentUser({ id: user.id, name: user.name })
    }
    const addUser = (user) => {
        setError(validateForm(user));
        const { name } = user;
        if (name) {
            messageUser('Agregado');
            setFadeIn(true);
            setIsLoading(true);
            db.collection('users').add({
                name: name
            }).catch((error) => {
                messageUser("Error", error);
            });
        }
    }
    const updateUser = (updatedUser) => {
        setIsLoading(true);
        setEditing(false);
        setFadeIn(true);
        messageUser('Actualizado');
        const { id, name } = updatedUser;
        db.collection('users').doc(id).update({
            name: name
        }).catch((error) => {
            messageUser('Error', error);
        });
    }
    const messageUser = (message) => {
        setMessage(message);
        setTimeout(() => {
            setMessage('');
            setFadeIn(false);
        }, 3500);
    }
    return (
        <>
            {isEditing ? (
                <EditUser
                    isEditing={isEditing}
                    setEditing={setEditing}
                    isCurrentUser={isCurrentUser}
                    updateUser={updateUser}
                />
            ) : (
                    <AddUser addUser={addUser} isError={isError} />
                )}
            <Fade in={isFadeIn} className="mt-4">
                <Alert color="success">
                    {isMessage}
                </Alert>
            </Fade>
            {
                isLoading ? (
                    <div className="flex-container">
                        <Spinner color="secondary" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                ) : (
                        isUsers && (
                            <Users data={isUsers} editId={editId} setEditing={setEditing} setIsLoading={setIsLoading} messageUser={messageUser} setFadeIn={setFadeIn} />
                        )
                    )
            }
        </>
    );
}

export default App;