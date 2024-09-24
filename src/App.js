import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [patients, setPatients] = useState([]);
  const [products, setProducts] = useState([]);
  const [showDiscounted, setShowDiscounted] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const patientResponse = await fetch("http://localhost:3001/patient");
        const patientData = await patientResponse.json();
        const productResponse = await fetch("http://localhost:3001/product");
        const productData = await productResponse.json();
        setProducts(productData.data);
        setPatients(patientData.data);
      } catch (error) {
        alert("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleProductChange = (patientId, productId) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.patient_id === patientId
          ? { ...patient, customer_productid: productId }
          : patient
      )
    );
  };

  const toggleDiscountedPrice = (patientId) => {
    setShowDiscounted((prev) => ({
      ...prev,
      [patientId]: !prev[patientId],
    }));
  };

  const getBasePrice = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.basePrice : 0;
  };

  const getDiscountedPrice = (basePrice, discount) => {
    return basePrice - (basePrice * discount) / 100;
  };

  return (
    <>
      <h1>Patient Management System</h1>
      <center>
        <div className="App">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Company Name</th>
                <th>Select Product</th>
                <th>Base Price</th>
                <th>Action</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => {
                const basePrice = getBasePrice(patient.customer_productid);
                const discountedPrice = getDiscountedPrice(
                  basePrice,
                  patient.customer_discount
                );
                return (
                  <tr key={patient.patient_id}>
                    <td>{patient.patient_name}</td>
                    <td>{patient.patient_phonenumber}</td>
                    <td>{patient.customername}</td>
                    <td>
                      <select
                        value={patient.customer_productid || ""}
                        onChange={(e) =>
                          handleProductChange(
                            patient.patient_id,
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{basePrice}</td>
                    <td>
                      <button
                        onClick={() =>
                          toggleDiscountedPrice(patient.patient_id)
                        }
                      >
                        {showDiscounted[patient.patient_id] ? "Hide" : "Show"}{" "}
                        Discounted Price
                      </button>
                    </td>
                    <td>
                      {showDiscounted[patient.patient_id]
                        ? discountedPrice.toFixed(2)
                        : basePrice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </center>
      <h2>Available Products</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Base Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.basePrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
