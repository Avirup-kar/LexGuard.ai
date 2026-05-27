import { useApi } from "@/config/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContractHistory() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const Api = useApi();

  const navigate = useNavigate();

  const riskStyles = {
    high: {
      border: "border-red-500/40",
      bg: "bg-red-500/10",
      text: "text-red-400",
    },
    medium: {
      border: "border-yellow-500/40",
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
    },
    safe: {
      border: "border-green-500/40",
      bg: "bg-green-500/10",
      text: "text-green-400",
    },
  };

  // const historyy = [
  //   {
  //     id: 1,
  //     contractTitle: "Freelance Web Dev Agreement",
  //     overallRisk: "high",
  //     overallSummary:
  //       "This contract heavily favors the client and exposes the contractor to unlimited liability.",
  //   },
  //   {
  //     id: 2,
  //     contractTitle: "UI Design Contract",
  //     overallRisk: "medium",
  //     overallSummary:
  //       "Most clauses are fair, but payment timelines and revision limits may need clarification.",
  //   },
  //   {
  //     id: 3,
  //     contractTitle: "Consulting Agreement",
  //     overallRisk: "safe",
  //     overallSummary:
  //       "The agreement is balanced with clear payment terms and reasonable liability limits.",
  //   },
  //   {
  //     id: 4,
  //     contractTitle: "Startup NDA",
  //     overallRisk: "high",
  //     overallSummary:
  //       "The NDA has extremely strict confidentiality clauses that could restrict future work.",
  //   },
  // ];

  const getHistory = async () => {
    try {
      setLoading(true);
      const { data } = await Api.get("/getApi/history/getAllProject");
      if(!data.success === true) return 
      setHistory(data?.project);
      setLoading(false);
    } catch (error) {
      console.error(error?.response?.data?.message || error.message)
      console.log(error);
    } finally {
      setLoading(false); // ✅ ALWAYS runs
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="p-6 pb-96">
      <h2 className="text-lg font-semibold mb-6">Contract History</h2>

      <div className="flex flex-col p-4 gap-4 min-h-[550px] lg:h-[550px] overflow-y-auto">
        {loading ? (
          // 🔥 Loading UI
          <div className="flex justify-center items-center w-full h-full">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : history?.length === 0 ? (
          // ❌ No data
          <div className="text-center text-gray-400 py-10">
            No history available
          </div>
        ) : (
          // ✅ Data available
          history?.map((contract) => {
            const style = riskStyles[contract?.contractData?.overallRisk];

            return (
              <button
                onClick={() => navigate(`/project/${contract?.id}`)}
                key={contract.id}
                className={`p-4 rounded-lg border-l-[6px] border ${style?.border} ${style?.bg} cursor-pointer flex flex-col items-start hover:scale-[1.02] transition`}
              >
                {/* Top Row */}
                <div className="flex justify-between items-center w-full mb-2">
                  <h3 className="font-semibold text-sm">
                    {contract?.contractData?.contractTitle}
                  </h3>

                  <p className={`text-xs ${style?.text}`}>
                    {contract?.contractData?.overallRisk?.toUpperCase()}
                  </p>
                </div>

                {/* Summary */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full">
                  <p className="text-xs text-gray-300 text-start leading-relaxed">
                    {contract?.contractData?.overallSummary}
                  </p>
                  <p className="text-xs text-gray-500 text-start mt-1">
                    {contract?.createdAt
                      ? new Date(contract.createdAt).toLocaleDateString([], {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
