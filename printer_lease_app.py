import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import csv

class PrinterLeaseComparatorApp:
    def __init__(self, master):
        self.master = master
        master.title("Printer Lease Contract Comparator")
        master.geometry("1000x700") # Adjust window size as needed

        # Style for consistency
        self.style = ttk.Style()
        self.style.configure("TFrame", background="#f0f0f0")
        self.style.configure("TLabel", background="#f0f0f0", font=('Arial', 10))
        self.style.configure("TButton", font=('Arial', 10, 'bold'))

        self.contracts = [] # List to store contract data (raw input)
        self.calculated_results = [] # List to store calculated comparison results
        self.contract_frames = [] # List to store frames for each contract
        self.input_entries = {} # Dictionary to hold entry widgets for easy access
        self.optional_cost_frames = {} # To store references to optional cost frames for toggling visibility

        self.main_frame = ttk.Frame(master, padding="15")
        self.main_frame.pack(fill=tk.BOTH, expand=True)

        self.create_widgets()

    def create_widgets(self):
        # Header
        header_label = ttk.Label(self.main_frame, text="Compare Printer Leasing Contracts", font=('Arial', 16, 'bold'))
        header_label.pack(pady=10)

        # Frame for contract input forms
        self.input_forms_frame = ttk.Frame(self.main_frame)
        self.input_forms_frame.pack(side=tk.LEFT, fill=tk.BOTH, padx=10, pady=5)

        # Frame for displaying results
        self.results_frame = ttk.Frame(self.main_frame)
        self.results_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=5)
        self.results_frame.columnconfigure(0, weight=1) # Make the first column expandable

        # Initially add one contract input form
        self.add_contract_form()

        # Buttons
        button_frame = ttk.Frame(self.main_frame)
        button_frame.pack(pady=10)

        add_contract_button = ttk.Button(button_frame, text="Add New Contract", command=self.add_contract_form)
        add_contract_button.pack(side=tk.LEFT, padx=5)

        compare_button = ttk.Button(button_frame, text="Compare Contracts", command=self.compare_contracts)
        compare_button.pack(side=tk.LEFT, padx=5)

        # New Save Results Button
        save_button = ttk.Button(button_frame, text="Save Results to CSV", command=self.save_results_to_csv)
        save_button.pack(side=tk.LEFT, padx=5)


        # Guidance section
        self.guidance_frame = ttk.Frame(self.main_frame, padding="10")
        self.guidance_frame.pack(pady=10, fill=tk.X)
        guidance_label = ttk.Label(self.guidance_frame, text="Guidance on Printer Lease Contracts:", font=('Arial', 12, 'bold'))
        guidance_label.pack(anchor=tk.W, pady=(0, 5))
        guidance_text = """
        When comparing contracts, consider:
        - Total Cost of Ownership (TCO) over the entire lease term.
        - Included page volumes vs. your estimated usage. Overage charges can add up!
        - Look for hidden fees: setup, delivery, early termination, end-of-lease.
        - Maintenance and service inclusions: What's covered? Response times?
        - Flexibility for upgrades or changes in print volume.
        - Reputation of the leasing company.
        """
        guidance_content = ttk.Label(self.guidance_frame, text=guidance_text, wraplength=450, justify=tk.LEFT)
        guidance_content.pack(anchor=tk.W)


    def add_contract_form(self):
        contract_number = len(self.contract_frames) + 1
        contract_frame = ttk.LabelFrame(self.input_forms_frame, text=f"Contract {contract_number} Details", padding="10")
        contract_frame.pack(pady=10, fill=tk.X, anchor=tk.N)
        self.contract_frames.append(contract_frame)

        # Store entries specific to this contract
        self.input_entries[f'contract_{contract_number}'] = {}
        # Keep track of the visibility state for optional costs for this contract
        self.optional_cost_frames[f'contract_{contract_number}'] = {
            'frame': None, # Will hold the frame for optional costs
            'visible': False # Initial state
        }


        standard_fields = [
            ("Contract Name:", "name", ""),
            ("Lease Term (months):", "lease_term", "36"),
            ("Monthly Lease Payment (€):", "monthly_payment", "100"),
            ("Cost Per Page B&W (€):", "cost_per_bw_page", "0.01"),
            ("Cost Per Page Color (€):", "cost_per_color_page", "0.10"),
            ("Included Pages B&W (monthly):", "included_bw_pages", "1000"),
            ("Included Pages Color (monthly):", "included_color_pages", "100"),
            ("Monthly Maintenance/Service Fee (€):", "monthly_maintenance", "10"),
            ("Initial Setup/Delivery Fee (€):", "initial_fee", "50"),
            ("End-of-Lease Buyout Option (€):", "buyout_option", "0"),
            ("Estimated Monthly B&W Prints:", "est_monthly_bw_prints", "1200"),
            ("Estimated Monthly Color Prints:", "est_monthly_color_prints", "150"),
        ]

        for i, (label_text, key, default_value) in enumerate(standard_fields):
            row_frame = ttk.Frame(contract_frame)
            row_frame.pack(fill=tk.X, pady=2)

            label = ttk.Label(row_frame, text=label_text, width=30, anchor=tk.W)
            label.pack(side=tk.LEFT)

            entry = ttk.Entry(row_frame, width=20)
            entry.insert(0, default_value)
            entry.pack(side=tk.RIGHT, expand=True, fill=tk.X)
            self.input_entries[f'contract_{contract_number}'][key] = entry

        # --- Optional Costs/Discounts Section ---
        optional_costs_button_frame = ttk.Frame(contract_frame)
        optional_costs_button_frame.pack(fill=tk.X, pady=(5, 0))

        add_optional_costs_btn = ttk.Button(optional_costs_button_frame,
                                            text="Add Optional Costs/Discounts (+)",
                                            command=lambda cn=contract_number: self.toggle_optional_costs(cn))
        add_optional_costs_btn.pack(side=tk.LEFT, pady=5)
        # Store button reference to change text later
        self.optional_cost_frames[f'contract_{contract_number}']['button'] = add_optional_costs_btn


        # Create the frame for optional costs but don't pack it initially
        optional_fields_frame = ttk.Frame(contract_frame, relief=tk.GROOVE, borderwidth=1, padding=5)
        self.optional_cost_frames[f'contract_{contract_number}']['frame'] = optional_fields_frame # Store reference

        optional_fields = [
            ("Additional One-Time Cost (€):", "additional_one_time_cost", "0"),
            ("One-Time Discount (€):", "one_time_discount", "0")
        ]

        for i, (label_text, key, default_value) in enumerate(optional_fields):
            row_frame = ttk.Frame(optional_fields_frame)
            row_frame.pack(fill=tk.X, pady=2)

            label = ttk.Label(row_frame, text=label_text, width=30, anchor=tk.W)
            label.pack(side=tk.LEFT)

            entry = ttk.Entry(row_frame, width=20)
            entry.insert(0, default_value)
            entry.pack(side=tk.RIGHT, expand=True, fill=tk.X)
            self.input_entries[f'contract_{contract_number}'][key] = entry # Still store in main input_entries


        # Add a "Remove Contract" button for each contract
        if contract_number > 1: # Don't allow removing the very first contract initially
            remove_button = ttk.Button(contract_frame, text="Remove This Contract",
                                       command=lambda num=contract_number: self.remove_contract_form(num))
            remove_button.pack(pady=5)

    def toggle_optional_costs(self, contract_number):
        contract_key = f'contract_{contract_number}'
        frame_info = self.optional_cost_frames[contract_key]
        optional_frame = frame_info['frame']
        toggle_button = frame_info['button']

        if frame_info['visible']:
            optional_frame.pack_forget() # Hide the frame
            frame_info['visible'] = False
            toggle_button.config(text="Add Optional Costs/Discounts (+)")
        else:
            optional_frame.pack(fill=tk.X, pady=(0, 5)) # Show the frame
            frame_info['visible'] = True
            toggle_button.config(text="Hide Optional Costs/Discounts (-)")


    def remove_contract_form(self, contract_num_to_remove):
        if len(self.contract_frames) > 1: # Ensure at least one contract remains
            # Remove the frame from display
            self.contract_frames[contract_num_to_remove - 1].destroy()

            # Remove from lists
            del self.contract_frames[contract_num_to_remove - 1]
            del self.input_entries[f'contract_{contract_num_to_remove}']
            # Remove the optional cost frame reference as well
            if f'contract_{contract_num_to_remove}' in self.optional_cost_frames:
                del self.optional_cost_frames[f'contract_{contract_num_to_remove}']


            # Re-index remaining contracts and update their titles
            for i, frame in enumerate(self.contract_frames):
                frame.config(text=f"Contract {i + 1} Details")
                # Also update the command for the toggle button if it exists, as its contract number might change
                contract_key = f'contract_{i + 1}'
                if contract_key in self.optional_cost_frames and 'button' in self.optional_cost_frames[contract_key]:
                    self.optional_cost_frames[contract_key]['button'].config(
                        command=lambda num=i+1: self.toggle_optional_costs(num)
                    )

            # Clear current results as they are no longer valid for the altered set of contracts
            for widget in self.results_frame.winfo_children():
                widget.destroy()
            self.calculated_results = [] # Clear stored results

        else:
            messagebox.showwarning("Cannot Remove", "You must have at least one contract to compare.")


    def compare_contracts(self):
        self.contracts = [] # Clear previous input data
        self.calculated_results = [] # Clear previous calculated results

        for i, frame in enumerate(self.contract_frames):
            contract_data = {}
            contract_num = i + 1
            entries = self.input_entries[f'contract_{contract_num}']
            try:
                contract_data['name'] = entries['name'].get() if entries['name'].get() else f"Contract {contract_num}"
                contract_data['lease_term'] = int(entries['lease_term'].get())
                contract_data['monthly_payment'] = float(entries['monthly_payment'].get())
                contract_data['cost_per_bw_page'] = float(entries['cost_per_bw_page'].get())
                contract_data['cost_per_color_page'] = float(entries['cost_per_color_page'].get())
                contract_data['included_bw_pages'] = int(entries['included_bw_pages'].get())
                contract_data['included_color_pages'] = int(entries['included_color_pages'].get())
                contract_data['monthly_maintenance'] = float(entries['monthly_maintenance'].get())
                contract_data['initial_fee'] = float(entries['initial_fee'].get())
                contract_data['buyout_option'] = float(entries['buyout_option'].get())
                contract_data['est_monthly_bw_prints'] = int(entries['est_monthly_bw_prints'].get())
                contract_data['est_monthly_color_prints'] = int(entries['est_monthly_color_prints'].get())

                # Safely get values for optional fields, defaulting to 0.0 if not present (e.g., frame hidden)
                contract_data['additional_one_time_cost'] = float(entries.get('additional_one_time_cost', tk.StringVar(value="0.0")).get())
                contract_data['one_time_discount'] = float(entries.get('one_time_discount', tk.StringVar(value="0.0")).get())

                self.contracts.append(contract_data)
            except ValueError as e:
                messagebox.showerror("Input Error", f"Please enter valid numbers for all fields in {contract_data.get('name', f'Contract {contract_num}')}. Error: {e}")
                return

        if not self.contracts:
            messagebox.showwarning("No Contracts", "Please add at least one contract to compare.")
            return

        self.calculate_and_display_results()

    def calculate_and_display_results(self):
        # Clear previous results
        for widget in self.results_frame.winfo_children():
            widget.destroy()

        self.calculated_results = [] # Reset calculated results list

        # Create a treeview for structured results
        columns = ("Contract", "Total Cost", "Effective Monthly", "Effective Cost/Page (B&W)", "Effective Cost/Page (Color)")
        self.tree = ttk.Treeview(self.results_frame, columns=columns, show="headings")
        self.tree.pack(fill=tk.BOTH, expand=True)

        for col in columns:
            self.tree.heading(col, text=col, anchor=tk.W)
            self.tree.column(col, width=150, anchor=tk.W) # Adjust column width

        # Calculate and insert data
        for contract in self.contracts:
            total_lease_payments = contract['monthly_payment'] * contract['lease_term']
            total_maintenance_fees = contract['monthly_maintenance'] * contract['lease_term']

            # Calculate overage costs
            overage_bw_pages = max(0, contract['est_monthly_bw_prints'] - contract['included_bw_pages'])
            overage_color_pages = max(0, contract['est_monthly_color_prints'] - contract['included_color_pages'])

            total_overage_cost_bw = overage_bw_pages * contract['cost_per_bw_page'] * contract['lease_term']
            total_overage_cost_color = overage_color_pages * contract['cost_per_color_page'] * contract['lease_term']

            total_cost = (total_lease_payments + total_maintenance_fees +
                          total_overage_cost_bw + total_overage_cost_color +
                          contract['initial_fee'] + contract['buyout_option'] +
                          contract['additional_one_time_cost'] - contract['one_time_discount'])

            effective_monthly_cost = total_cost / contract['lease_term']

            total_estimated_bw_prints = contract['est_monthly_bw_prints'] * contract['lease_term']
            total_estimated_color_prints = contract['est_monthly_color_prints'] * contract['lease_term']

            # Avoid division by zero if no prints are estimated
            effective_cost_per_bw_page = total_cost / total_estimated_bw_prints if total_estimated_bw_prints > 0 else 0
            effective_cost_per_color_page = total_cost / total_estimated_color_prints if total_estimated_color_prints > 0 else 0

            # Store the calculated results for CSV export
            self.calculated_results.append({
                "Contract Name": contract['name'],
                "Total Cost": total_cost,
                "Effective Monthly Cost": effective_monthly_cost,
                "Effective Cost Per Page (B&W)": effective_cost_per_bw_page,
                "Effective Cost Per Page (Color)": effective_cost_per_color_page
            })

            # Insert into Treeview for display
            self.tree.insert("", tk.END, values=(
                contract['name'],
                f"{total_cost:,.2f} €",
                f"{effective_monthly_cost:,.2f} €",
                f"{effective_cost_per_bw_page:.4f} €",
                f"{effective_cost_per_color_page:.4f} €"
            ))

        # Add scrollbar to treeview
        scrollbar = ttk.Scrollbar(self.results_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

    def save_results_to_csv(self):
        if not self.calculated_results:
            messagebox.showwarning("No Results", "Please run the comparison first to generate results.")
            return

        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
            title="Save Comparison Results"
        )

        if file_path:
            try:
                with open(file_path, mode='w', newline='', encoding='utf-8') as file:
                    fieldnames = list(self.calculated_results[0].keys())
                    writer = csv.DictWriter(file, fieldnames=fieldnames)

                    writer.writeheader()
                    writer.writerows(self.calculated_results)

                messagebox.showinfo("Save Successful", f"Results saved to:\n{file_path}")
            except Exception as e:
                messagebox.showerror("Save Error", f"An error occurred while saving the file: {e}")


def main():
    root = tk.Tk()
    app = PrinterLeaseComparatorApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()