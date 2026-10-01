import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTripById,
  generateTripItinerary,
  getTripExpenses,
  getExpenseSummary,
  createExpense,
  deleteExpense,
} from "../services/api";
import { getDestinationImage } from "../services/imageService";
import "../styles/TripDetails.css";

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const [expenses, setExpenses] = useState([]);
const [expenseSummary, setExpenseSummary] = useState(null);
const [loadingExpenses, setLoadingExpenses] = useState(true);
const [showExpenseForm, setShowExpenseForm] = useState(false);
const [expenseTitle, setExpenseTitle] = useState("");
const [expenseAmount, setExpenseAmount] = useState("");
const [expensePaidBy, setExpensePaidBy] = useState("");
const [expenseSplitBetween, setExpenseSplitBetween] = useState([]);
const [savingExpense, setSavingExpense] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await getTripById(id);
        setTrip(data);

        const destinationImage = await getDestinationImage(
          data.destination
        );

        setImage(destinationImage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const handleGenerateItinerary = async () => {
  try {
    setGenerating(true);

    const data = await generateTripItinerary(id);

    setTrip((currentTrip) => ({
      ...currentTrip,
      aiItinerary: data.itinerary,
    }));
  } catch (err) {
    alert(err.message);
  } finally {
    setGenerating(false);
  }
};

const loadExpenses = async () => {
  try {
    setLoadingExpenses(true);

    const [expenseData, summaryData] = await Promise.all([
      getTripExpenses(id),
      getExpenseSummary(id),
    ]);

    setExpenses(expenseData);
    setExpenseSummary(summaryData);
  } catch (err) {
    console.error("Failed to load expenses:", err);
  } finally {
    setLoadingExpenses(false);
  }
};

  useEffect(() => {
    loadExpenses();
  }, [id]);

const handleDeleteExpense = async (expenseId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this expense?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteExpense(expenseId);

    await loadExpenses();
  } catch (err) {
    alert(err.message);
  }
};

const handleSplitChange = (name) => {
  setExpenseSplitBetween((current) => {
    if (current.includes(name)) {
      return current.filter((person) => person !== name);
    }

    return [...current, name];
  });
};

const handleAddExpense = async (event) => {
  event.preventDefault();

  if (!expenseTitle.trim()) {
    alert("Please enter an expense name.");
    return;
  }

  if (!expenseAmount || Number(expenseAmount) <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (!expensePaidBy) {
    alert("Please select who paid.");
    return;
  }

  if (expenseSplitBetween.length === 0) {
    alert("Select at least one person to split the expense.");
    return;
  }

  try {
    setSavingExpense(true);

    await createExpense({
      title: expenseTitle.trim(),
      amount: Number(expenseAmount),
      paidBy: expensePaidBy,
      splitBetween: expenseSplitBetween.map((name) => ({
        name,
      })),
      tripId: id,
    });

    setExpenseTitle("");
    setExpenseAmount("");
    setExpensePaidBy("");
    setExpenseSplitBetween([]);
    setShowExpenseForm(false);

    await loadExpenses();
  } catch (err) {
    alert(err.message);
  } finally {
    setSavingExpense(false);
  }
};

  if (loading) {
    return (
      <main className="trip-details-page">
        <div className="trip-details-loading">
          Loading your trip...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="trip-details-page">
        <div className="trip-details-error">
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard")}>
            Back to trips
          </button>
        </div>
      </main>
    );
  }

  if (!trip) {
    return null;
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  const tripDays =
    Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    ) + 1;

  return (
    <main className="trip-details-page">

      <div className="trip-details-container">

        <button
          className="back-to-trips"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to trips
        </button>

        <section className="trip-hero">

          <div className="trip-hero-image">
            {image && (
              <img
                src={image}
                alt={trip.destination}
              />
            )}
          </div>

          <div className="trip-hero-content">

            <span className="trip-location">
              {trip.destination}
            </span>

            <h1>{trip.name}</h1>

            <p className="trip-dates">
              {startDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              {" — "}
              {endDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

          </div>

        </section>

        <section className="trip-overview">

          <div className="overview-item">
            <span>TRAVELERS</span>
            <strong>{trip.members.length}</strong>
          </div>

          <div className="overview-item">
            <span>BUDGET</span>
            <strong>₹{trip.budget}</strong>
          </div>

          <div className="overview-item">
            <span>DURATION</span>
            <strong>{tripDays} days</strong>
          </div>

        </section>

        <section className="trip-info-grid">

          <div className="trip-info-card">
            <span className="section-label">YOUR TRAVEL STYLE</span>

            <p>
              {trip.vibe || "No preferences added yet."}
            </p>
          </div>

          <div className="trip-info-card">
            <span className="section-label">TRAVELERS</span>

            <div className="traveler-list">
              {trip.members.map((member, index) => (
                <div className="traveler" key={index}>
                  <span className="traveler-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </span>

                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

<section className="itinerary-section">

  <div className="itinerary-heading">
    <div>
      <span className="section-label">
        YOUR ITINERARY
      </span>

      <h2>Let Scout plan the journey.</h2>

      <p>
        Your trip details are ready. Scout can turn them
        into a day-by-day travel plan.
      </p>
    </div>

    <button
      className="scout-button"
      onClick={handleGenerateItinerary}
      disabled={generating}
    >
      {generating ? "Scout is planning..." : "Plan with Scout"}
    </button>
  </div>

  {trip.aiItinerary ? (
    <div className="itinerary-result">

      <div className="itinerary-view-toggle">
        <button
          className={!showFullItinerary ? "active" : ""}
          onClick={() => setShowFullItinerary(false)}
        >
          Quick View
        </button>

        <button
          className={showFullItinerary ? "active" : ""}
          onClick={() => setShowFullItinerary(true)}
        >
          Full Itinerary
        </button>
      </div>

      {showFullItinerary ? (
        <div className="full-itinerary">
          {trip.aiItinerary
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, index) => (
              <p key={index}>{line}</p>
            ))}
        </div>
      ) : (
        <div className="quick-itinerary">

          {trip.aiItinerary
            .split("\n")
            .filter((line) => {
              const text = line.trim().toLowerCase();

              return (
                text.startsWith("day ") ||
                /^\d{1,2}(:\d{2})?\s*(am|pm)/i.test(line.trim())
              );
            })
            .map((line, index) => (
              <p key={index}>{line}</p>
            ))}

          <div className="quick-itinerary-note">
            <p>
              This is a quick overview of your trip.
            </p>

            <button
              onClick={() => setShowFullItinerary(true)}
            >
              View full itinerary →
            </button>
          </div>

        </div>
      )}

    </div>
  ) : (
    <div className="itinerary-empty">

      <span className="empty-number">01</span>

      <div>
        <h3>Your itinerary will appear here.</h3>

        <p>
          Places to explore, food to try, and things to
          experience — all organised around your trip.
        </p>
      </div>

    </div>
  )}

</section>

        <section className="expenses-section">

          <div className="expenses-heading">
            <div>
              <span className="section-label">TRIP EXPENSES</span>

              <h2>Keep the money part simple.</h2>

              <p>
                Track shared expenses and see who owes whom.
              </p>
            </div>

            <button
              className="add-expense-button"
              onClick={() => setShowExpenseForm(true)}
            >
              + Add expense
            </button>
                   </div>

          {showExpenseForm && (
            <form
              className="expense-form"
              onSubmit={handleAddExpense}
            >
              <div className="expense-form-header">

                <div>
                  <span className="section-label">
                    NEW EXPENSE
                  </span>

                  <h3>Add something you shared.</h3>
                </div>

                <button
                  type="button"
                  className="expense-form-close"
                  onClick={() => setShowExpenseForm(false)}
                >
                  ×
                </button>

              </div>

              <div className="expense-form-grid">

                <div className="expense-field">
                  <label>WHAT WAS IT?</label>

                  <input
                    type="text"
                    placeholder="Dinner, hotel, cab..."
                    value={expenseTitle}
                    onChange={(event) =>
                      setExpenseTitle(event.target.value)
                    }
                  />
                </div>

                <div className="expense-field">
                  <label>AMOUNT</label>

                  <div className="amount-input">
                    <span>₹</span>

                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0"
                      value={expenseAmount}
                      onChange={(event) =>
                        setExpenseAmount(event.target.value)
                      }
                    />
                  </div>
                </div>

              </div>

              <div className="expense-field">
                <label>WHO PAID?</label>

                <select
                  value={expensePaidBy}
                  onChange={(event) =>
                    setExpensePaidBy(event.target.value)
                  }
                >
                  <option value="">Select person</option>

                  {trip.members.map((member, index) => (
                    <option
                      key={index}
                      value={member.name}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="expense-field">
                <label>SPLIT BETWEEN</label>

                <div className="split-members">

                  {trip.members.map((member, index) => {
                    const selected =
                      expenseSplitBetween.includes(member.name);

                    return (
                      <button
                        type="button"
                        key={index}
                        className={`split-member ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleSplitChange(member.name)
                        }
                      >
                        <span>
                          {selected ? "✓" : ""}
                        </span>

                        {member.name}
                      </button>
                    );
                  })}

                </div>
              </div>

              <div className="expense-form-actions">

                <button
                  type="button"
                  className="expense-cancel-button"
                  onClick={() => setShowExpenseForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="expense-save-button"
                  disabled={savingExpense}
                >
                  {savingExpense
                    ? "Adding..."
                    : "Add expense"}
                </button>

              </div>

            </form>
          )}

          {loadingExpenses ? (
            <div className="expenses-loading">
              Loading expenses...
            </div>
          ) : (
            <>
              <div className="expense-summary-grid">

                <div className="expense-summary-card">
                  <span>TOTAL SPENT</span>

                  <strong>
                    ₹
                    {expenses
                      .reduce(
                        (total, expense) =>
                          total + expense.amount,
                        0
                      )
                      .toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="expense-summary-card">
                  <span>EXPENSES</span>

                  <strong>{expenses.length}</strong>
                </div>

              </div>

              {expenses.length === 0 ? (
                <div className="expenses-empty">
                  <span className="empty-number">02</span>

                  <div>
                    <h3>No expenses yet.</h3>

                    <p>
                      Add your first shared expense and PACKT
                      will keep track of the split.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="expense-list">

                  {expenses.map((expense) => (
                    <div
                      className="expense-item"
                      key={expense._id}
                    >

                      <div className="expense-main">
  <h3>{expense.title}</h3>

  <p>
    Paid by {expense.paidBy}
  </p>

  <div className="expense-split">
    Split between{" "}
    {expense.splitBetween
      .map((person) => person.name)
      .join(" · ")}
  </div>
</div>

                      <div className="expense-amount">
                        ₹
                        {expense.amount.toLocaleString("en-IN")}
                      </div>

                      <button
                        className="delete-expense-button"
                        onClick={() =>
                          handleDeleteExpense(expense._id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  ))}

                </div>
              )}

{expenseSummary?.settlements?.length > 0 && (
  <div className="settlements-section">

    <div className="settlements-header">
      <div>
        <span className="section-label">
          FINAL SETTLEMENT
        </span>

        <h3>Who needs to pay whom.</h3>

        <p>
          These amounts are calculated after combining all
          shared expenses in this trip.
        </p>
      </div>
    </div>

    <div className="settlement-list">

      {expenseSummary.settlements.map(
        (settlement, index) => (
          <div
            className="settlement-item"
            key={index}
          >

            <div className="settlement-person">
              <span className="settlement-label">
                PAYS
              </span>

              <strong>
                {settlement.from}
              </strong>
            </div>

            <span className="settlement-arrow">
              →
            </span>

            <div className="settlement-person">
              <span className="settlement-label">
                RECEIVES
              </span>

              <strong>
                {settlement.to}
              </strong>
            </div>

            <strong className="settlement-amount">
              ₹
              {settlement.amount.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                }
              )}
            </strong>

          </div>
        )
      )}

    </div>

  </div>
)}

            </>
          )}

        </section>

      </div>

    </main>
  );
}

export default TripDetails;