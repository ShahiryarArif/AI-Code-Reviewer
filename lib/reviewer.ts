export type ReviewRequest = {
  code: string;
  language: string;
  focus: string;
};

export type ReviewItem = {
  title: string;
  detail: string;
  severity: "high" | "medium" | "low";
};

export type ReviewResponse = {
  summary: string;
  score: number;
  maintainability: "High" | "Moderate" | "Low";
  improvements: ReviewItem[];
  positive: string;
  nextTests: string[];
};

export const sampleSnippets = [
  {
    id: "async-side-effects",
    label: "Async side effects",
    language: "TypeScript",
    focus: "Maintainability",
    code: `function save(items) {
  items.map(async i=>db.insert(i));
  if(items.length>0) {
    notify()
  }
}`,
  },
  {
    id: "react-branching",
    label: "React branching",
    language: "React",
    focus: "Readability",
    code: `export function Checkout({ items, user, loading }) {
            if (!loading) {
              if (items && items.length > 0) {
                return <div>{user && user.name ? user.name : "Guest"} - {items.map((item) => <span key={item.id}>{item.name}</span>)}</div>;
              } else {
                return <div>No items</div>;
              }
            } else {
              return <div>Loading...</div>;
            }
          }`,
  },
  {
    id: "node-handler",
    label: "Node handler",
    language: "JavaScript",
    focus: "Testing",
    code: `app.post("/orders", async (req, res) => {
  const body = req.body;
  if (body && body.items && body.items.length) {
    const created = await orderService.create(body);
    cache.set("last-order", created);
    res.send(created);
  } else {
    res.status(400).send("bad request");
  }
});`,
  },
];
