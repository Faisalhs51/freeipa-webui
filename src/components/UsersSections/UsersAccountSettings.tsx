/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  DropdownItem,
  CalendarMonth,
  Button,
} from "@patternfly/react-core";
// Data types
import {
  IDPServer,
  Metadata,
  User,
  RadiusServer,
} from "src/utils/datatypes/globalDataTypes";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import DataTimePickerLayout from "src/components/layouts/Calendar/DataTimePickerLayout";
import CalendarButton from "src/components/layouts/Calendar/CalendarButton";
import CalendarLayout from "src/components/layouts/Calendar/CalendarLayout";
import PopoverWithIconLayout from "src/components/layouts/PopoverWithIconLayout";
import ModalWithTextAreaLayout from "src/components/layouts/ModalWithTextAreaLayout";
// Modals
import CertificateMappingDataModal from "src/components/modals/CertificateMappingDataModal";
// Utils
import { asRecord } from "src/utils/userUtils";
// Form
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaSelect from "../Form/IpaSelect";
import IpaCheckboxes from "../Form/IpaCheckboxes";
import PrincipalAliasMultiTextBox from "../Form/PrincipalAliasMultiTextBox";

interface PropsToUsersAccountSettings {
  user: Partial<User>;
  onUserChange: (element: Partial<User>) => void;
  metadata: Metadata;
  onRefresh: () => void;
  radiusProxyConf: RadiusServer[];
  idpConf: IDPServer[];
}

// Generic data to pass to the Textbox adder
interface ElementData {
  id: string | number;
  element: string;
}

const UsersAccountSettings = (props: PropsToUsersAccountSettings) => {
  // TODO: Handle the `has_password` variable (boolean) by another Ipa component
  const [password] = useState("");

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  // Dropdown 'Radius proxy configuration'
  const radiusProxyList = props.radiusProxyConf.map((item) =>
    item.cn.toString()
  );

  // Dropdown 'External IdP configuration'
  const idpConfOptions = props.idpConf.map((item) => item.cn.toString());

  // SSH public keys
  // -Text area
  const [textAreaSshPublicKeysValue, setTextAreaSshPublicKeysValue] =
    useState("");
  const [isTextAreaSshPublicKeysOpen, setIsTextAreaSshPublicKeysOpen] =
    useState(false);

  const onChangeTextAreaSshPublicKeysValue = (value: string) => {
    setTextAreaSshPublicKeysValue(value);
  };

  const onClickSetTextAreaSshPublicKeys = () => {
    // Store data here
    // Closes the modal
    setIsTextAreaSshPublicKeysOpen(false);
  };

  const onClickCancelTextAreaSshPublicKeys = () => {
    // Closes the modal
    setIsTextAreaSshPublicKeysOpen(false);
  };

  const openSshPublicKeysModal = () => {
    setIsTextAreaSshPublicKeysOpen(true);
  };

  const sshPublicKeysOptions = [
    <SecondaryButton key="set" onClickHandler={onClickSetTextAreaSshPublicKeys}>
      Set
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onClickCancelTextAreaSshPublicKeys}
    >
      Cancel
    </Button>,
  ];

  // Certificates
  // -Text area
  const [textAreaCertificatesValue, setTextAreaCertificatesValue] =
    useState("");
  const [isTextAreaCertificatesOpen, setIsTextAreaCertificatesOpen] =
    useState(false);

  const onChangeTextAreaCertificatesValue = (value: string) => {
    setTextAreaCertificatesValue(value);
  };

  const onClickAddTextAreaCertificates = () => {
    // Store data here
    // Closes the modal
    setIsTextAreaCertificatesOpen(false);
  };

  const onClickCancelTextAreaCertificates = () => {
    // Closes the modal
    setIsTextAreaCertificatesOpen(false);
  };

  const openCertificatesModal = () => {
    setIsTextAreaCertificatesOpen(true);
  };

  const certificatesOptions = [
    <SecondaryButton key="add" onClickHandler={onClickAddTextAreaCertificates}>
      Add
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onClickCancelTextAreaCertificates}
    >
      Cancel
    </Button>,
  ];

  // Certificate mapping data
  // - Radio buttons
  const [certMappingDataCheck, setCertMappingDataCheck] = useState(true);
  const [issuerAndSubjectCheck, setIssuerAndSubjectCheck] = useState(false);

  const onChangeMappingDataCheck = (value: boolean) => {
    setCertMappingDataCheck(value);
    setIssuerAndSubjectCheck(!value);
  };

  const onChangeIssuerAndSubjectCheck = (value: boolean) => {
    setIssuerAndSubjectCheck(value);
    setCertMappingDataCheck(!value);
  };

  // -- Issuer and subject textboxes
  const [issuer, setIssuer] = useState("");
  const [subject, setSubject] = useState("");
  // -- Temporal values for issuer and subject. This helps to restore the original
  //    values when the modal is close without saving (instead of showing empty
  //    textboxes/textareas)
  const [issuerTemp, setIssuerTemp] = useState(issuer);
  const [subjectTemp, setSubjectTemp] = useState(subject);

  const onChangeIssuer = (value: string) => {
    setIssuerTemp(value);
  };
  const onChangeSubject = (value: string) => {
    setSubjectTemp(value);
  };

  // -- Certificate mapping data: Lists and generated textboxe and textarea
  const [certificateMappingDataList, setCertificateMappingDataList] = useState<
    ElementData[]
  >([]);
  const [certificateList, setCertificateList] = useState<ElementData[]>([]);
  // -- Copy of the data to be used as a temporal values. This helps to restore the
  //   original values when the modal is close without saving (instead of showing empty
  //   textboxes/textareas)
  const [certificateMappingDataListTemp, setCertificateMappingDataListTemp] =
    useState<ElementData[]>([]);
  const [certificateListTemp, setCertificateListTemp] =
    useState<ElementData[]>(certificateList);
  // -- Deep-copy of the data that will be used for a short-term copy on simple operations.
  const certificateMappingDataListCopy = structuredClone(
    certificateMappingDataListTemp
  );
  const certificateListCopy = structuredClone(certificateListTemp);

  // --- 'Add certificate mapping data' handler
  const onAddCertificateMappingDataHandler = () => {
    certificateMappingDataListCopy.push({
      id: Date.now.toString(),
      element: "",
    });
    setCertificateMappingDataListTemp(certificateMappingDataListCopy);
  };

  // --- 'Change certificate mapping data' handler
  const onHandleCertificateMappingDataChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    certificateMappingDataListCopy[idx]["element"] = (
      event.target as HTMLInputElement
    ).value;
    setCertificateMappingDataListTemp(certificateMappingDataListCopy);
  };

  // --- 'Remove certificate mapping data' handler
  const onRemoveCertificateMappingDataHandler = (idx: number) => {
    certificateMappingDataListCopy.splice(idx, 1);
    setCertificateMappingDataListTemp(certificateMappingDataListCopy);
  };

  // --- 'Add certificate' handler
  const onAddCertificateHandler = () => {
    certificateListCopy.push({
      id: Date.now.toString(),
      element: "",
    });
    setCertificateListTemp(certificateListCopy);
  };

  // --- 'Change certificate' handler
  const onHandleCertificateChange = (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => {
    certificateListCopy[idx]["element"] = (
      event.target as HTMLTextAreaElement
    ).value;
    setCertificateListTemp(certificateListCopy);
  };

  // --- 'Remove certificate' handler
  const onRemoveCertificateHandler = (idx: number) => {
    certificateListCopy.splice(idx, 1);
    setCertificateListTemp(certificateListCopy);
  };

  // - Modal
  const [
    isCertificatesMappingDataModalOpen,
    setIsCertificatesMappingDataModalOpen,
  ] = useState(false);

  // -- Close modal
  const onCloseCertificatesMappingData = () => {
    // Reset values on lists | original -> temp
    setCertificateMappingDataListTemp(certificateMappingDataList);
    setCertificateListTemp(certificateList);
    // Reset values on 'issuer and subject' values | original -> temp
    setIssuerTemp(issuer);
    setSubjectTemp(subject);
    // Close the modal
    setIsCertificatesMappingDataModalOpen(false);
  };

  // -- Open modal
  const openCertificatesMappingDataModal = () => {
    setIsCertificatesMappingDataModalOpen(true);
  };

  // -- Add data
  const onAddCertificateMappingData = () => {
    // Add temp values into the original lists | temp -> original
    if (certMappingDataCheck) {
      setCertificateMappingDataList(certificateMappingDataListTemp);
      setCertificateList(certificateListTemp);
    } else {
      // Reset values | original -> temp
      setCertificateMappingDataListTemp(certificateMappingDataList);
      setCertificateListTemp(certificateList);
    }
    // Add temp values to the 'issuer and subject' values | temp -> original
    if (issuerAndSubjectCheck) {
      setIssuer(issuerTemp);
      setSubject(subjectTemp);
    } else {
      // Reset values | original -> temp
      setIssuerTemp(issuer);
      setSubjectTemp(subject);
    }
    // Close the modal
    setIsCertificatesMappingDataModalOpen(false);
  };

  const certificatesMappingDataActions = [
    <SecondaryButton key="add" onClickHandler={onAddCertificateMappingData}>
      Add
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onCloseCertificatesMappingData}
    >
      Cancel
    </Button>,
  ];

  // Date and time picker (Calendar)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isTimeOpen, setIsTimeOpen] = React.useState(false);
  const [valueDate, setValueDate] = React.useState("YYYY-MM-DD");
  const [valueTime, setValueTime] = React.useState("HH:MM");
  const times = Array.from(new Array(10), (_, i) => i + 10);
  const defaultTime = "0:00";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dateFormat = (date: any) =>
    date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");

  const onToggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
    setIsTimeOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const onToggleTime = (_ev: any) => {
    setIsTimeOpen(!isTimeOpen);
    setIsCalendarOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectCalendar = (newValueDate: any) => {
    const newValue = dateFormat(newValueDate);
    setValueDate(newValue);
    setIsCalendarOpen(!isCalendarOpen);
    // setting default time when it is not picked
    if (valueTime === "HH:MM") {
      setValueTime(defaultTime);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectTime = (ev: any) => {
    setValueTime(ev.target.value);
    setIsTimeOpen(!isTimeOpen);
  };

  const timeOptions = times.map((time) => (
    <DropdownItem key={time} component="button" value={`${time}:00`}>
      {`${time}:00`}
    </DropdownItem>
  ));

  const calendar = (
    <CalendarMonth date={new Date(valueDate)} onChange={onSelectCalendar} />
  );

  const time = (
    <DataTimePickerLayout
      dropdownOnSelect={onSelectTime}
      toggleAriaLabel="Toggle the time picker menu"
      toggleIndicator={null}
      toggleOnToggle={onToggleTime}
      toggleStyle={{ padding: "6px 16px" }}
      dropdownIsOpen={isTimeOpen}
      dropdownItems={timeOptions}
    />
  );

  const calendarButton = (
    <CalendarButton
      ariaLabel="Toggle the calendar"
      onClick={onToggleCalendar}
    />
  );

  // Messages for the popover
  const certificateMappingDataMessage = () => (
    <div>
      <p>Add one or more certificate mappings to the user entry</p>
    </div>
  );
  const userAuthTypesMessage = () => (
    <div>
      <p>
        Per-user setting, overwrites the global setting if any option is
        checked.
      </p>
      <p>
        <b>Password + Two-factor:</b> LDAP and Kerberos allow authentication
        with either one of the authentication types but Kerberos uses
        pre-authentication method which requires to use armor cache.
      </p>
      <p>
        <b>RADIUS with another type:</b> Kerberos always use RADIUS, but LDAP
        never does. LDAP only recognize the password and two-factor
        authentication options.
      </p>
    </div>
  );

  // Render 'UsersAccountSettings'
  return (
    <>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-u-mb-lg">
            <FormGroup label="User login" fieldId="user-login">
              <IpaTextInput
                name={"uid"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Password" fieldId="password">
              <TextInput
                id="password"
                name="has_password"
                value={password}
                type="password"
                aria-label="password"
                readOnlyVariant="plain"
              />
            </FormGroup>
            <FormGroup
              label="Password expiration"
              fieldId="password-expiration"
            >
              <IpaTextInput
                name={"krbpasswordexpiration"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="UID" fieldId="uid">
              <IpaTextInput
                name={"uidnumber"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="GID" fieldId="gid">
              <IpaTextInput
                name={"gidnumber"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Kerberos principal alias"
              fieldId="kerberos-principal-alias"
            >
              <PrincipalAliasMultiTextBox
                ipaObject={ipaObject}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
              />
            </FormGroup>
            <FormGroup
              label="Kerberos principal expiration (UTC)"
              fieldId="kerberos-principal-expiration"
            >
              <CalendarLayout
                name="krbprincipalexpiration"
                position="bottom"
                bodyContent={calendar}
                showClose={false}
                isVisible={isCalendarOpen}
                hasNoPadding={true}
                hasAutoWidth={true}
                textInputId="date-time"
                textInputAriaLabel="date and time picker"
                textInputValue={valueDate + " " + valueTime}
              >
                {calendarButton}
                {time}
              </CalendarLayout>
            </FormGroup>
            <FormGroup label="Login shell" fieldId="login-shell">
              <IpaTextInput
                name={"loginshell"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-u-mb-lg">
            <FormGroup label="Home directory" fieldId="home-directory">
              <IpaTextInput
                name={"homedirectory"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="SSH public keys" fieldId="ssh-public-keys">
              <SecondaryButton onClickHandler={openSshPublicKeysModal}>
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup label="Certificates" fieldId="certificates">
              <SecondaryButton onClickHandler={openCertificatesModal}>
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup
              label="Certificate mapping data"
              fieldId="certificate-mapping-data"
              labelIcon={
                <PopoverWithIconLayout
                  message={certificateMappingDataMessage}
                />
              }
            >
              <SecondaryButton
                onClickHandler={openCertificatesMappingDataModal}
              >
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup
              label="User authentication types"
              fieldId="user-authentication-types"
              labelIcon={
                <PopoverWithIconLayout message={userAuthTypesMessage} />
              }
            >
              <IpaCheckboxes
                name="ipauserauthtype"
                options={[
                  {
                    value: "password",
                    text: "Password",
                  },
                  {
                    value: "radius",
                    text: "RADIUS",
                  },
                  {
                    value: "otp",
                    text: "Two-factor authentication (password + OTP)",
                  },
                  {
                    value: "pkinit",
                    text: "PKINIT",
                  },
                  {
                    value: "hardened",
                    text: "Hardened password (by SPAKE or FAST)",
                  },
                  {
                    value: "idp",
                    text: "External Identity Provider",
                  },
                ]}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Radius proxy configuration"
              fieldId="radius-proxy-configuration"
            >
              <IpaSelect
                id="radius-proxy-configuration"
                name="ipatokenradiusconfiglink"
                options={radiusProxyList}
                ipaObject={ipaObject}
                setIpaObject={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Radius proxy username"
              fieldId="radius-proxy-username"
            >
              <IpaTextInput
                name={"ipatokenradiususername"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="External IdP configuration"
              fieldId="external-idp-configuration"
            >
              <IpaSelect
                id="external-idp-configuration"
                name="ipaidpconfiglink"
                options={idpConfOptions}
                ipaObject={ipaObject}
                setIpaObject={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="External IdP user identifier"
              fieldId="external-idp-user-identifier"
            >
              <IpaTextInput
                name={"ipaidpsub"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
        </FlexItem>
      </Flex>
      <ModalWithTextAreaLayout
        value={textAreaSshPublicKeysValue}
        onChange={onChangeTextAreaSshPublicKeysValue}
        isOpen={isTextAreaSshPublicKeysOpen}
        onClose={onClickCancelTextAreaSshPublicKeys}
        actions={sshPublicKeysOptions}
        title="Set SSH key"
        subtitle="SSH public key:"
        cssName="ipasshpubkey"
        ariaLabel="new ssh public key modal text area"
      />
      <ModalWithTextAreaLayout
        value={textAreaCertificatesValue}
        onChange={onChangeTextAreaCertificatesValue}
        isOpen={isTextAreaCertificatesOpen}
        onClose={onClickCancelTextAreaCertificates}
        actions={certificatesOptions}
        title="New certificate"
        subtitle="Certificate in base64 or PEM format:"
        cssName="usercertificate"
        ariaLabel="new certificate modal text area"
      />
      <CertificateMappingDataModal
        // Modal options
        isOpen={isCertificatesMappingDataModalOpen}
        onClose={onCloseCertificatesMappingData}
        actions={certificatesMappingDataActions}
        // First radio option: Certificate mapping data
        isCertMappingDataChecked={certMappingDataCheck}
        onChangeCertMappingDataCheck={onChangeMappingDataCheck}
        // Second radio option: Issuer and subject
        isIssuerAndSubjectChecked={issuerAndSubjectCheck}
        onChangeIssuerAndSubjectCheck={onChangeIssuerAndSubjectCheck}
        issuerValue={issuerTemp}
        subjectValue={subjectTemp}
        onChangeIssuer={onChangeIssuer}
        onChangeSubject={onChangeSubject}
        // Generated texboxes, textareas, and data
        certificateMappingDataList={certificateMappingDataListTemp}
        certificateList={certificateListTemp}
        onAddCertificateMappingDataHandler={onAddCertificateMappingDataHandler}
        onHandleCertificateMappingDataChange={
          onHandleCertificateMappingDataChange
        }
        onRemoveCertificateMappingDataHandler={
          onRemoveCertificateMappingDataHandler
        }
        onAddCertificateHandler={onAddCertificateHandler}
        onHandleCertificateChange={onHandleCertificateChange}
        onRemoveCertificateHandler={onRemoveCertificateHandler}
      />
    </>
  );
};

export default UsersAccountSettings;
