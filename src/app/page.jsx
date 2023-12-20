"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  getCompanyData,
} from "../features/company/companySlice";
import { useCallback, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("CompanyName");
  const companyStatus = searchParams.get("CompanyStatus");
  const companys = useSelector((state) => state.company.data);
  const lastPage = useSelector((state) => state.company.lastPage);
  const count = useSelector((state) => state.company.value);

  const dispatch = useDispatch();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    let searchParams = "";
    if (search && companyStatus && count > 1) {
      searchParams = `?company_name=${search}&company_status=${companyStatus}&page=${count}`;
    } else if (search && companyStatus) {
      searchParams = `?company_name=${search}&company_status=${companyStatus}`;
    } else if (companyStatus && count > 1) {
      searchParams = `?company_status=${companyStatus}&page=${count}`;
    } else if (search && count > 1) {
      searchParams = `?company_name=${search}&page=${count}`;
    } else if (search) {
      searchParams = `?company_name=${search}`;
    } else if (companyStatus) {
      searchParams = `?company_status=${companyStatus}`;
    } else if (count > 1) {
      searchParams = `?page=${count}`;
    }

    fetch(
      `http://139.59.35.127/production/propsoft-api/public/api/get-all-companys${searchParams}`
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch(getCompanyData(data));

        console.log(data);
      })

      .catch((error) => console.error(error));
  }, [search, dispatch, companyStatus, count]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    const queryString = createQueryString(name, value);

    router.push(pathname + "?" + queryString);
  }

  function handleCompanyStatusChange(event) {
    const { name, value } = event.target;
    const queryString = createQueryString(name, value);

    router.push(pathname + "?" + queryString);
  }
  function handlePreviousClick() {
    if (count === 1) {
      return;
    }
    const queryString = createQueryString("page", count - 1);

    router.push(pathname + "?" + queryString);
    dispatch(decrement());
  }
  function handleNextClick() {
    if (count >= lastPage) {
      return;
    }
    const queryString = createQueryString("page", count + 1);

    router.push(pathname + "?" + queryString);
    dispatch(increment());
  }
  return (
    <div>
      <div>
        <div className=" flex justify-center pt-5 gap-4">
          <label htmlFor="CompanyName">
            <input
              onChange={handleInputChange}
              placeholder="Search Company"
              id="CompanyName"
              className="text-violet-500 input input-bordered input-primary w-full max-w-xs"
              value={search || ""}
              type="text"
              name="CompanyName"
            />
          </label>
          <div className="flex gap-10 pt-3">
            <div>
              <label htmlFor="CompanyStatus">
                <b className="text-violet-500">Status 1</b>
                <input
                  className="radio radio-primary"
                  onChange={handleCompanyStatusChange}
                  type="radio"
                  name="CompanyStatus"
                  value={1}
                />
              </label>
            </div>

            <div>
              <label htmlFor="CompanyStatus">
                <input
                  className="radio radio-primary"
                  onChange={handleCompanyStatusChange}
                  type="radio"
                  name="CompanyStatus"
                  value={0}
                />
                <b className="text-violet-500">Status 0</b>
              </label>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto pt-4">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th className="text-violet-500">Company Name</th>
                <th className="text-violet-500">Company Phone</th>
                <th className="text-violet-500">Company Address</th>
                <th className="text-violet-500">Company Logo</th>
                <th className="text-violet-500">Company Status</th>
              </tr>
            </thead>
            <tbody>
              {companys.map((company) => (
                <tr key={company.id}>
                  <td>{company.company_name}</td>
                  <td>{company.company_phone}</td>
                  <td>{company.address1}</td>
                  <td>
                    <img
                      className="w-20 h-20"
                      src={company.company_logo_link}
                      alt={company.company_name}
                    />
                  </td>
                  <td>{company.company_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col items-center justify-center gap-3">
            {(companys.length >= 5 && count > 1) ||
              (companys.length < 5 && count > 2 && (
                <button
                  className="btn btn-primary w-40"
                  onClick={handlePreviousClick}
                >
                  Previous
                </button>
              ))}

            {companys.length >= 5 && count < lastPage && (
              <button
                className="btn btn-primary w-40"
                onClick={handleNextClick}
              >
                Next
              </button>
            )}

            {count > 1 && count < lastPage && (
              <button
                className="btn btn-primary w-40 "
                onClick={handlePreviousClick}
              >
                Previous
              </button>
            )}
          </div>
        </div>

        {/* <pre>{JSON.stringify(companys, null, 2)}</pre> */}
      </div>
    </div>
  );
}
