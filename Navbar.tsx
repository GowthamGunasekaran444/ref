"use client"

import type React from "react"
import { useState } from "react"
import {
  Drawer,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Menu,
  MenuItem,
  Tooltip, // Import Tooltip for hover text
} from "@mui/material"
import { Button, Select, DatePicker, Space } from "antd"
import {
  Search as SearchIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
  DriveFileRenameOutline as RenameIcon,
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material"

const { RangePicker } = DatePicker
const { Option } = Select

interface NavbarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  miniSidebarWidth: number
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen, miniSidebarWidth }) => {
  const [scopeExpanded, setScopeExpanded] = useState(true)
  const [historyExpanded, setHistoryExpanded] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    chatId: string
  } | null>(null)

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const handleContextMenu = (event: React.MouseEvent, chatId: string) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            chatId,
          }
        : null,
    )
  }

  const handleContextMenuClose = () => {
    setContextMenu(null)
  }

  const handleShare = (chatId: string) => {
    console.log("Share chat:", chatId)
    handleContextMenuClose()
  }

  const handleRename = (chatId: string) => {
    console.log("Rename chat:", chatId)
    handleContextMenuClose()
  }

  const handleDelete = (chatId: string) => {
    console.log("Delete chat:", chatId)
    handleContextMenuClose()
  }

  const chatHistoryData = [
    {
      category: "Today",
      chats: [
        { id: "1", title: "Quality Analysis Report" },
        { id: "2", title: "Production Metrics Review" },
      ],
    },
    {
      category: "Past 7 Days",
      chats: [
        { id: "3", title: "Monthly Quality Assessment" },
        { id: "4", title: "Defect Rate Analysis" },
        { id: "5", title: "Process Improvement Discussion" },
      ],
    },
    {
      category: "Past 30 Days",
      chats: [
        { id: "6", title: "Quarterly Review Meeting" },
        { id: "7", title: "Supplier Quality Audit" },
        { id: "8", title: "Customer Feedback Analysis" },
      ],
    },
  ]

  const commonIconStyle = { color: "white", fontSize: "24px" }
  const commonIconButtonSx = {
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  }

  const miniSidebar = (
    <Box
      sx={{
        width: miniSidebarWidth,
        height: "100vh",
        background: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "16px",
        paddingBottom: "16px",
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      {/* Expand Icon */}
      <Tooltip title="Expand Navbar" placement="right">
        <IconButton onClick={toggleDrawer} sx={{ ...commonIconButtonSx, marginBottom: "16px" }}>
          <ChevronRightIcon sx={commonIconStyle} />
        </IconButton>
      </Tooltip>

      {/* Define The Scope Icon */}
      <Tooltip title="Define The Scope" placement="right">
        <IconButton onClick={() => setIsOpen(true)} sx={commonIconButtonSx}>
          <EditIcon sx={commonIconStyle} />
        </IconButton>
      </Tooltip>

      {/* Chat History Icon */}
      <Tooltip title="Chat History" placement="right">
        <IconButton onClick={() => setIsOpen(true)} sx={commonIconButtonSx}>
          <HistoryIcon sx={commonIconStyle} />
        </IconButton>
      </Tooltip>

      {/* Spacer to push profile to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Profile Icon */}
      <Tooltip title="Sarah Paul" placement="right">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          SP
        </Box>
      </Tooltip>
    </Box>
  )

  const fullSidebarContent = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        background: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
        color: "white",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={toggleDrawer} sx={{ color: "white", padding: "4px" }}>
            {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Quality GPT
          </Typography>
        </Box>
        <IconButton sx={{ color: "white" }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "100px", // Ensure space for the fixed profile section
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* New Chat Button */}
        <Box sx={{ padding: "16px" }}>
          <Button
            type="default"
            icon={<AddIcon />}
            block
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              height: "40px",
              borderRadius: "8px",
            }}
          >
            New Chat
          </Button>
        </Box>

        {/* Define The Scope Section */}
        <Box sx={{ padding: "0 16px" }}>
          <Accordion
            expanded={scopeExpanded}
            onChange={() => setScopeExpanded(!scopeExpanded)}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                scopeExpanded ? <ExpandLessIcon sx={{ color: "white" }} /> : <ExpandMoreIcon sx={{ color: "white" }} />
              }
              sx={{
                padding: "8px 0",
                minHeight: "auto",
                "& .MuiAccordionSummary-content": {
                  margin: "8px 0",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EditIcon sx={{ color: "white", fontSize: "16px" }} />
                <Typography sx={{ color: "white", fontSize: "14px" }}>Define The Scope</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0 0 16px 0" }}>
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {/* Business Group */}
                <Box>
                  <Typography sx={{ color: "white", fontSize: "12px", marginBottom: "8px" }}>Business Group</Typography>
                  <Select defaultValue="All" style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1e40af" }}>
                    <Option value="All">All</Option>
                    <Option value="Group1">Group 1</Option>
                    <Option value="Group2">Group 2</Option>
                  </Select>
                </Box>

                {/* Business Unit */}
                <Box>
                  <Typography sx={{ color: "white", fontSize: "12px", marginBottom: "8px" }}>Business Unit</Typography>
                  <Select defaultValue="All" style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1e40af" }}>
                    <Option value="All">All</Option>
                    <Option value="Unit1">Unit 1</Option>
                    <Option value="Unit2">Unit 2</Option>
                  </Select>
                </Box>

                {/* Plant */}
                <Box>
                  <Typography sx={{ color: "white", fontSize: "12px", marginBottom: "8px" }}>Plant</Typography>
                  <Select defaultValue="All" style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1e40af" }}>
                    <Option value="All">All</Option>
                    <Option value="Plant1">Plant 1</Option>
                    <Option value="Plant2">Plant 2</Option>
                  </Select>
                </Box>

                {/* Time Frame */}
                <Box>
                  <Typography sx={{ color: "white", fontSize: "12px", marginBottom: "8px" }}>Time Frame</Typography>
                  <RangePicker
                    style={{ width: "100%" }}
                    format="DD-MMM-YYYY"
                    placeholder={["DD-MMM-YYYY", "DD-MMM-YYYY"]}
                  />
                </Box>
              </Space>
              {/* Apply and Clear Buttons */}
              <Box sx={{ display: "flex", gap: 1, marginTop: "16px" }}>
                <Button
                  style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderColor: "rgba(255,255,255,0.9)",
                    color: "#1e40af",
                    flex: 1,
                    borderRadius: "6px",
                    fontWeight: "500",
                  }}
                >
                  Apply
                </Button>
                <Button
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                    flex: 1,
                    borderRadius: "6px",
                  }}
                >
                  Clear
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Chat History Section */}
        <Box sx={{ padding: "0 16px", marginTop: "16px" }}>
          <Accordion
            expanded={historyExpanded}
            onChange={() => setHistoryExpanded(!historyExpanded)}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                historyExpanded ? (
                  <ExpandLessIcon sx={{ color: "white" }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "white" }} />
                )
              }
              sx={{
                padding: "8px 0",
                minHeight: "auto",
                "& .MuiAccordionSummary-content": {
                  margin: "8px 0",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HistoryIcon sx={{ color: "white", fontSize: "16px" }} />
                <Typography sx={{ color: "white", fontSize: "14px" }}>Chat History</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0 0 24px 0" }}>
              {chatHistoryData.map((section) => (
                <Box key={section.category} sx={{ marginBottom: "16px" }}>
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}
                  >
                    {section.category}
                  </Typography>
                  {section.chats.map((chat) => (
                    <Box
                      key={chat.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        marginBottom: "4px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "13px",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {chat.title}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: "rgba(255,255,255,0.6)", padding: "2px" }}
                        onClick={(e) => handleContextMenu(e, chat.id)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>

      {/* User Profile Section - Fixed at bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            SP
          </Box>
          <Box>
            <Typography sx={{ color: "white", fontSize: "14px", fontWeight: "500" }}>Sarah Paul</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>Quality Manager</Typography>
          </Box>
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        PaperProps={{
          sx: {
            backgroundColor: "#1e40af",
            color: "white",
            "& .MuiMenuItem-root": {
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => contextMenu && handleShare(contextMenu.chatId)}>
          <ShareIcon sx={{ marginRight: 1, fontSize: "16px" }} />
          Share
        </MenuItem>
        <MenuItem onClick={() => contextMenu && handleRename(contextMenu.chatId)}>
          <RenameIcon sx={{ marginRight: 1, fontSize: "16px" }} />
          Rename
        </MenuItem>
        <MenuItem onClick={() => contextMenu && handleDelete(contextMenu.chatId)}>
          <DeleteIcon sx={{ marginRight: 1, fontSize: "16px" }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )

  return (
    <>
      {/* Full Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
            border: "none",
          },
        }}
      >
        {fullSidebarContent}
      </Drawer>

      {/* Mini Sidebar (collapsed state) */}
      {!isOpen && miniSidebar}
    </>
  )
}

export default Navbar
