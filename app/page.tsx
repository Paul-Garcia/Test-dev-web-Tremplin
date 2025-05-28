"use client";

import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';

export default function ContactForm() {
  type Disponibilite = {
    day: string;
    hour: number;
    minute: number;
  };

  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [day, setDay] = useState("Lundi");
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);

  const addDisponibilite = () => {
    const newDispo: Disponibilite = { day, hour, minute };
    const exists = disponibilites.some(
      d => d.day === newDispo.day && d.hour === newDispo.hour && d.minute === newDispo.minute
    );
    if (!exists) {
      setDisponibilites(prev => [...prev, newDispo]);
    }
  };

  const removeDisponibilite = (toRemove: Disponibilite) => {
    setDisponibilites(prev =>
      prev.filter(d => !(d.day === toRemove.day && d.hour === toRemove.hour && d.minute === toRemove.minute))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      contact: {
        civilite: formData.get("civilite"),
        lastName: formData.get("nom"),
        firstName: formData.get("prenom"),
        email: formData.get("email"),
        phone: formData.get("telephone"),
        messageType: formData.get("messageType"),
        message: formData.get("message"),
      },
      availabilities: disponibilites,
    };
    console.log(JSON.stringify(body))
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      alert("Message envoyé avec succès !");
      form.reset();
      setDisponibilites([]);
    } catch (err) {
      alert("Échec de l'envoi. Veuillez réessayer.");
      console.error(err);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center p-2 bg-white">
      <Card 
        className="w-100 shadowrounder-input" 
        style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/salon.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <Card.Body className="p-4">
          <Card.Title className="h4 mb-4 text-white fw-bold">CONTACTEZ L'AGENCE</Card.Title>

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Coordonnées */}
              <Col md={6}>
                <h6 className="mb-3 text-white fw-bold">VOS COORDONNÉES</h6>

                <Form.Group className="mb-3">
                  <div className="d-flex gap-3 text-white" >
                    <Form.Check
                      type="radio"
                      name="civilite"
                      value="Mme"
                      label="Mme"
                      required
                    />
                    <Form.Check
                      type="radio"
                      name="civilite"
                      value="M"
                      label="M"
                    />
                  </div>
                </Form.Group>

                <Row className="g-2">
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Control name="nom" placeholder="Nom" className="rounder-input" required />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Control name="prenom" placeholder="Prénom" className="rounder-input" required />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Control name="email" type="email" placeholder="Adresse mail" className="rounder-input" required />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Control name="telephone" type="tel" placeholder="Téléphone" className="rounder-input" required />
                </Form.Group>
              </Col>

              {/* Message */}
              <Col md={6}>
                <h6 className="mb-3 text-white fw-bold">VOTRE MESSAGE</h6>

                <Form.Group className="mb-3 text-white">
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      name="messageType"
                      value="Demande"
                      label="Demande de visite"
                      required
                    />
                    <Form.Check
                      type="radio"
                      name="messageType"
                      value="Rappel"
                      label="Être rappelé.e"
                    />
                    <Form.Check
                      type="radio"
                      name="messageType"
                      value="Photos"
                      label="Plus de photos"
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    name="message"
                    as="textarea"
                    rows={4}
                    className= "rounder-input"
                    placeholder="Votre message"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4 g-4 align-items-start">
              <Col md={9}>
                <h6 className="mb-3 text-white fw-bold">DISPONIBILITÉS POUR UNE VISITE</h6>

                <Row className="g-2 align-items-center">
                  <Col xs="auto">
                    <Form.Select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="rounder-input"
                      style={{ minWidth: '120px' }}
                    >
                      {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map(j => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col xs="auto">
                    <Form.Select
                      value={hour}
                      onChange={(e) => setHour(Number(e.target.value))}
                      className="rounder-input"
                      style={{ minWidth: '80px' }}
                    >
                      {[...Array(24)].map((_, i) => (
                        <option key={i} value={i}>{i}h</option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col xs="auto">
                    <Form.Select
                      value={minute}
                      onChange={(e) => setMinute(Number(e.target.value))}
                      className="rounder-input"
                      style={{ minWidth: '80px' }}
                    >
                      {[0, 15, 30, 45].map(m => (
                        <option key={m} value={m}>{m}m</option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col xs="auto">
                    <Button className="rounder-input btn-purple" onClick={addDisponibilite}>
                      Ajouter Dispo
                    </Button>
                  </Col>
                </Row>

                <div className="mt-3">
                  {disponibilites.map((d) => (
                    <Badge
                      key={`${d.day} à ${d.hour}-${d.minute}`}
                      bg="secondary"
                      className="me-2 mb-2 px-3 py-2 fs-6 fw-semibold badge-custom"
                      onClick={() => removeDisponibilite(d)}
                    >
                      {`${d.day} - ${d.hour}h${d.minute.toString().padStart(2, "0")}m`} ×
                    </Badge>
                  ))}
                </div>
              </Col>

              {/* Bouton Envoyer */}
              <Col md={3}>
                <Button
                  type="submit"
                  variant="warning"
                  className="w-100 rounder-input py-2 text-white"
                >
                  Envoyer
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
