import Link from 'next/link'
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import styles from "./Footer.module.scss"

export default function Footer() {
  return (
    <div id={styles.footer}>
      <Container>
        <Row>
          <Col md={4} xs={12}>
            <h5>Column 1</h5>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
          </Col>

          <Col md={4} xs={12}>
            <h5>Column 2</h5>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
          </Col>

          <Col md={4} xs={12}>
            <h5>Column 3</h5>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
            <p><Link href="/">Option</Link></p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

