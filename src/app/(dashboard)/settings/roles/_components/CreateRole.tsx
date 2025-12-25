"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { handleApiErrors } from "@/utils/api-utils/hanle-api-error";
import { SuccessAlert } from "@/components/alerts/SuccessAlert";
import {
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from "@mui/material";
import { CustomInput } from "@/components/custom/CustomInput";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { useParams, useRouter } from "next/navigation";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomMenuItem } from "@/components/custom/CustomMenuItem";
import Loader from "@/components/Loader";
import { createRole, getRole, updateRole } from "@/features/iam/role/service";
import { getPolicies } from "@/features/iam/policy/service";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getMeWallet } from "@/features/agent/apis/service";

const CreateRole: React.FC = () => {
  const router: any = useRouter();
  const params: any = useParams();

  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { payload: agentWallet },
      } = await getMeWallet();

      const {
        data: { payload: policies },
      } = await getPolicies();

      setPolicies(
        policies.filter(
          (item: any) =>
            agentWallet.wallet?.isActiveCreditBalance ||
            item.module !== "Credit"
        )
      );

      if (params.id === "new") {
        setFormData({ isActive: true });
        return;
      }

      setIsLoading(true);
      const {
        data: { payload: newData },
      } = await getRole(params.id);

      if (newData.policies?.length) {
        newData.policyIds = newData.policies.map((item: any) =>
          Number(item.id)
        );
      }

      setFormData(newData);
      setIsLoading(false);
    })();
  }, [params]);

  const handleChange = ({ target }: any) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleCheckboxChange = (policyId: any) => {
    const currentPolicyIds = formData.policyIds || [];

    const newPolicyIds = currentPolicyIds.includes(policyId)
      ? currentPolicyIds.filter((id: any) => id !== policyId)
      : [...currentPolicyIds, policyId];

    setFormData({ ...formData, policyIds: newPolicyIds });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newData = { ...formData };

    try {
      const result = formData.id
        ? await updateRole(newData)
        : await createRole(newData);
      if (result.data) {
        SuccessAlert(
          `Role ${formData.id ? "Updated" : "Created"} Successfully`
        );
        router.push("/settings/roles");
      }
    } catch (error) {
      const errorMessage = handleApiErrors(error);
      ErrorAlert(errorMessage);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Box className="form-container">
      <Box className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <Grid item xs={12} sm={12} md={12} mb={3}>
            <Typography className="form-title" mb={2}>
              {formData.id ? "Update Role" : "Create Role"}
            </Typography>

            <hr className="tab-divider" />
          </Grid>
          <Grid container spacing={2} rowSpacing={3}>
            <Grid item xs={12} md={6}>
              <label className="form-label">
                <span className="form-required">*</span> Name
              </label>
              <CustomInput
                required
                name="name"
                onChange={handleChange}
                placeholder="Enter Name"
                value={formData.name || ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <label className="form-label">Status</label>
              <CustomSelect
                name="isActive"
                displayEmpty
                onChange={handleChange}
                value={
                  formData.isActive !== undefined ? formData.isActive : true
                }
              >
                <CustomMenuItem value={"true"}>Active</CustomMenuItem>
                <CustomMenuItem value={"false"}>Inactive</CustomMenuItem>
              </CustomSelect>
            </Grid>

            <Grid item xs={12}>
              <h4 className="normal-header">Assign a policy to this role</h4>
              {policies.map((item: any) => (
                <Accordion key={item.module}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h3 className="normal-header-2">{item.module}</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      {item.policies.map((resource: any) => (
                        <Grid item xs={12} md={3} key={resource.name}>
                          <span style={{ fontSize: "16px" }}>
                            {resource.name}
                          </span>
                          <Grid container spacing={1} mt={1}>
                            {resource.children?.map((policy: any) => (
                              <Grid item md={12} key={policy.id}>
                                <Checkbox
                                  disableRipple
                                  className="custom-checkbox"
                                  checked={
                                    formData.policyIds?.includes(policy.id) ||
                                    false
                                  }
                                  onChange={() =>
                                    handleCheckboxChange(policy.id)
                                  }
                                />
                                <span className="normal-text">
                                  {policy.name}
                                </span>
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button type="submit" className="submit-button">
                Submit
              </button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default CreateRole;
