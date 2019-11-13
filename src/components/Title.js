import React from 'react';
import { Container, Row, Col, Jumbotron } from 'reactstrap';

export const Title = () => {
    return (
        <Container>
            <Row>
                <Col xs="12">
                    <Jumbotron className="text-center">
                        <h1 className="display-5">To-do lista de cosas por hacer</h1>
                    </Jumbotron>
                </Col>
            </Row>
        </Container>
    );
}

export default Title; 