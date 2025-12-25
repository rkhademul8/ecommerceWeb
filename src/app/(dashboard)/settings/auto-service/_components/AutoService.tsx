"use client";

import React, { useEffect, useState } from "react";
import { Box, GridLegacy as Grid, Switch, Typography } from "@mui/material";
import Loader from "@/components/Loader";
import { getMeAgent, updateMeAgent } from "@/features/agent/apis/service";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";

const AutoService = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<any>({});
  const [autoServices, setAutoServices] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setLoading({ data: true });

      const { data } = await getMeAgent();

      setAutoServices([
        {
          id: data.payload?.id,
          key: "isPartialAutoSettle",
          serviceType: "Partial Payment Settlement",
          value: data.payload?.isPartialAutoSettle,
        },
        // {
        //   id: data.payload?.id,
        //   key: "isCreditAutoSettle",
        //   serviceType: "Credit Settlement",
        //   value: data.payload?.isCreditAutoSettle,
        // },
      ]);

      setLoading({ data: false });
    })();
  }, []);

  const handleToggleEnable = (id: number, key: string, value: boolean) => {
    const updatedServices = autoServices.map((service: any) =>
      service.id === id && service.key === key ? { ...service, value } : service
    );

    setData({ id, key, value });
    setAutoServices(updatedServices);
  };

  const handleSubmit = async () => {
    setLoading({ ...loading, submit: true });

    setTimeout(async () => {
      try {
        const newData = {
          id: data.id,
          [data.key]: data.value,
        };

        const result = await updateMeAgent(newData);

        if (result.data) {
          setData({ id: null, key: null, value: null });
          SuccessAlert("Successfully updated auto service setting");
        }
      } catch (error) {
        const errorMessage = handleApiErrors(error);
        ErrorAlert(errorMessage);
      } finally {
        setLoading({ ...loading, submit: false });
      }
    }, 500);
  };

  if (loading.data) return <Loader />;

  return (
    <Box className="main-box" mb={5}>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12} sm={12} md={12}>
          <Grid item xs={12} sm={12} md={12} mb={3}>
            <Typography className="form-title" mb={2}>
              Auto Service Enabled
            </Typography>

            <hr className="tab-divider" />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            {autoServices.map((service: any) => (
              <Box
                key={service.id}
                sx={{
                  mb: 2,
                  display: "flex",
                  padding: "3px 10px",
                  borderRadius: "8px",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: "1px solid #E0E0E0",
                  justifyContent: "space-between",
                }}
              >
                <Typography className="normal-text-2">
                  {service.serviceType}
                </Typography>

                <Box>
                  <Switch
                    checked={service.value}
                    onChange={() =>
                      handleToggleEnable(
                        service.id,
                        service.key,
                        !service.value
                      )
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#01783B",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#01783B",
                        },
                    }}
                  />

                  {data.id === service.id && (
                    <button
                      onClick={handleSubmit}
                      className={`action-submit-button ${
                        loading.submit ? "disabled" : ""
                      }`}
                      disabled={loading.submit || data.key !== service.key}
                    >
                      Save
                    </button>
                  )}
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AutoService;
