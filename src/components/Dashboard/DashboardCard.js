import React from "react";
import {
  DashboardContainer,
  DashboardWrapper,
  DashboardHeading,
  DashCard,
  DashContent,
  DashContainerCard,
  DashContentCard,
  DashContainerCardIcon,
  DashContainerCardContent,
  DashContainerCardContentTotal,
  DashContainerCardContentNumber,
  DashContainerCardContentOrder,
  DashIcon,
  DashHeading,
} from "./DashboardElement";

const DashboardCard = (props) => {
  return (
    <div>
      <DashContainerCard>
        <DashContentCard>
          <DashContainerCardContent>
            <DashContainerCardContentOrder>
            {props.title}
            </DashContainerCardContentOrder>
            <DashContainerCardContentNumber>
              {props.value}
            </DashContainerCardContentNumber>
          </DashContainerCardContent>
          <DashContainerCardIcon>
            <i className={`fa-solid ${props.icon}`}></i>
          </DashContainerCardIcon>
        </DashContentCard>
      </DashContainerCard>
    </div>
  );
};

export default DashboardCard;
