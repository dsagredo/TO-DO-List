import React from 'react';
import { Row, Col, Jumbotron } from 'reactstrap';

export const Title = () => {
    return(
        <>
            <Row>
                <Col xs="12">
                    <Jumbotron className="text-center">
                        <h1 className="display-5">Todo App</h1>
                        <p>ReactJS + Firestore</p>
                    </Jumbotron>
                </Col>
            </Row>
        </>
    );
} 

export default Title; 