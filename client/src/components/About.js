function About() {
  return (
    <div className="m-4 ">
      <h5>Savings Calculator App by Varun Gokte</h5>
      <br />
      <h3>Technology Stack</h3>

      <ul>
        <div className="row">
          <div className="col" style={{ width: "100000px" }}>
            <b>Frontend:</b>
            <ul>
              <li>
                <span className="text-danger">React.js</span>
              </li>
              <li>Bootstrap</li>
              <li>HTML & CSS</li>
            </ul>
          </div>
          <div className="col" style={{ width: "10%" }}>
            <b>Backend:</b>
            <ul>
              <li>
                <span className="text-danger">Node.js</span>
              </li>
              <li>Express</li>
              <li>Mongoose</li>
            </ul>
          </div>
          <div className="col">
            <span>JWT</span>
            <br />
            <b>Database:</b>
            <ul>
              <li>
                <span className="text-danger"> MongoDB</span>
              </li>
            </ul>
            <b>Deployed Using</b> <span className="text-danger">TBD</span>
          </div>
        </div>
      </ul>

      <h3>About the website</h3>
      <ul>
        <li>
          There is a page where you can add one or more income sources; each
          source has a name and the amount (in ₹).
        </li>
        <li>You can also edit or delete a source.</li>
        <li>There is a similar page for expenses, where you can list items.</li>
        <li>There is a summary page which shows you your savings.</li>
      </ul>
      <h3>How to use the website</h3>
      <ul>
        <li>
          Click the Sign Up button in the top-right corner, enter details as
          required to become a user.
        </li>
        <li>
          Then log in to the website and you will see the home page/dashboard.
        </li>
      </ul>
    </div>
  );
}

export default About;
